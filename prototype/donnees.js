// Couche de données — MODE DÉMO.
// Tout est enregistré dans le navigateur (localStorage).
// Pour passer au serveur PHP, seul ce fichier sera remplacé : l'interface
// (app.js) n'appelle que les fonctions de l'objet `Donnees` ci-dessous, qui
// renvoient toutes une promesse (comme le feront les appels au serveur).

(function () {
  const CLE = "idq-pilotage-gestion-demo";
  const CLE_UTILISATEUR = "idq-pilotage-gestion-utilisateur";

  // Champs dont chaque changement est inscrit à l'historique
  const CHAMPS_SUIVIS = {
    statut: "Statut",
    priorite: "Priorité",
    debut: "Début",
    fin: "Fin",
    enContinu: "En continu",
    echeance: "Échéance",
  };

  let etat = null;

  const copie = (o) => JSON.parse(JSON.stringify(o));
  const nouvelId = (prefixe) =>
    prefixe + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function enregistrer() {
    try {
      localStorage.setItem(CLE, JSON.stringify(etat));
    } catch (e) {
      console.warn("Enregistrement impossible dans ce navigateur", e);
    }
  }

  function utilisateur() {
    let nom = null;
    try { nom = localStorage.getItem(CLE_UTILISATEUR); } catch (e) {}
    return etat.utilisateurs.includes(nom) ? nom : etat.utilisateurs[0];
  }

  function tracer(briqueId, actionId, champ, avant, apres) {
    etat.historique.unshift({
      id: nouvelId("h"),
      date: new Date().toISOString(),
      auteur: utilisateur(),
      briqueId,
      actionId,
      champ,
      avant: avant === undefined ? null : avant,
      apres: apres === undefined ? null : apres,
    });
  }

  function appliquer(objet, champs, briqueId, actionId) {
    for (const [cle, valeur] of Object.entries(champs)) {
      if (cle === "id") continue;
      const avant = objet[cle];
      if (JSON.stringify(avant) === JSON.stringify(valeur)) continue;
      if (CHAMPS_SUIVIS[cle]) tracer(briqueId, actionId, cle, avant, valeur);
      objet[cle] = valeur;
    }
  }

  const ok = (valeur) => Promise.resolve(valeur === undefined ? undefined : copie(valeur));

  window.Donnees = {
    mode: "demo",
    CHAMPS_SUIVIS,

    charger() {
      let brut = null;
      try { brut = localStorage.getItem(CLE); } catch (e) {}
      etat = brut ? JSON.parse(brut) : copie(window.DONNEES_DEPART);
      enregistrer();
      return ok(etat);
    },

    // Lecture synchrone de l'état courant (copie)
    lire() { return copie(etat); },

    utilisateurCourant() { return utilisateur(); },
    changerUtilisateur(nom) {
      try { localStorage.setItem(CLE_UTILISATEUR, nom); } catch (e) {}
      return ok();
    },

    majObjectif({ ambition, objectif }) {
      Object.assign(etat.objectif, {
        ambition, objectif,
        modifiePar: utilisateur(),
        modifieLe: new Date().toISOString(),
      });
      enregistrer();
      return ok(etat.objectif);
    },

    // --- Briques ---
    creerBrique(champs) {
      const ordre = Math.max(0, ...etat.briques.map((b) => b.ordre)) + 1;
      const brique = {
        id: nouvelId("b"), ordre,
        nom: "", objectif: "", responsables: [], debut: null, fin: null,
        enContinu: false, moyens: "", statut: "a-ouvrir", priorite: "moyenne",
        ...champs,
      };
      etat.briques.push(brique);
      tracer(brique.id, null, "creation", null, brique.nom);
      enregistrer();
      return ok(brique);
    },

    majBrique(id, champs) {
      const brique = etat.briques.find((b) => b.id === id);
      if (!brique) return Promise.reject(new Error("Brique introuvable"));
      appliquer(brique, champs, id, null);
      enregistrer();
      return ok(brique);
    },

    supprimerBrique(id) {
      etat.briques = etat.briques.filter((b) => b.id !== id);
      etat.actions = etat.actions.filter((a) => a.briqueId !== id);
      etat.historique = etat.historique.filter((h) => h.briqueId !== id);
      enregistrer();
      return ok();
    },

    reordonnerBriques(ids) {
      ids.forEach((id, i) => {
        const b = etat.briques.find((x) => x.id === id);
        if (b) b.ordre = i + 1;
      });
      enregistrer();
      return ok();
    },

    // --- Actions ---
    creerAction(briqueId, champs) {
      const ordre = Math.max(0, ...etat.actions.filter((a) => a.briqueId === briqueId).map((a) => a.ordre)) + 1;
      const action = {
        id: nouvelId("a"), briqueId, ordre,
        intitule: "", responsables: [], note: "", echeance: null,
        statut: "a-faire", priorite: "moyenne", commentaire: "",
        ...champs,
      };
      etat.actions.push(action);
      tracer(briqueId, action.id, "creation", null, action.intitule);
      enregistrer();
      return ok(action);
    },

    majAction(id, champs) {
      const action = etat.actions.find((a) => a.id === id);
      if (!action) return Promise.reject(new Error("Action introuvable"));
      appliquer(action, champs, action.briqueId, id);
      enregistrer();
      return ok(action);
    },

    supprimerAction(id) {
      const action = etat.actions.find((a) => a.id === id);
      if (!action) return ok();
      etat.actions = etat.actions.filter((a) => a.id !== id);
      tracer(action.briqueId, null, "suppression", action.intitule, null);
      enregistrer();
      return ok();
    },

    reordonnerActions(briqueId, ids) {
      ids.forEach((id, i) => {
        const a = etat.actions.find((x) => x.id === id && x.briqueId === briqueId);
        if (a) a.ordre = i + 1;
      });
      enregistrer();
      return ok();
    },

    // --- Responsables ---
    ajouterResponsable(nom) {
      const propre = nom.trim();
      if (!propre) return Promise.reject(new Error("Nom vide"));
      const existant = etat.responsables.find((r) => r.nom.toLowerCase() === propre.toLowerCase());
      if (existant) {
        existant.actif = true;
        enregistrer();
        return ok(existant);
      }
      const resp = { id: nouvelId("r"), nom: propre, actif: true };
      etat.responsables.push(resp);
      enregistrer();
      return ok(resp);
    },

    majResponsable(id, champs) {
      const resp = etat.responsables.find((r) => r.id === id);
      if (!resp) return Promise.reject(new Error("Responsable introuvable"));
      Object.assign(resp, champs);
      enregistrer();
      return ok(resp);
    },

    // --- Démo ---
    reinitialiser() {
      etat = copie(window.DONNEES_DEPART);
      enregistrer();
      return ok(etat);
    },
  };
})();
