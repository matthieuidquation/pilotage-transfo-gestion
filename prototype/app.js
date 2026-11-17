// Outil de pilotage de la feuille de route du service gestion — interface.
// Les données passent uniquement par l'objet `Donnees` (voir donnees.js).

// ---------------------------------------------------------------------------
// Libellés
// ---------------------------------------------------------------------------
const STATUTS_BRIQUE = { "a-ouvrir": "À ouvrir", ouverte: "Ouverte", terminee: "Terminée" };
const STATUTS_ACTION = { "a-faire": "À faire", "en-cours": "En cours", fait: "Fait", bloque: "Bloqué" };
const PRIORITES = { haute: "Haute", moyenne: "Moyenne", basse: "Basse" };
const RANG_PRIORITE = { haute: 1, moyenne: 2, basse: 3 };

// ---------------------------------------------------------------------------
// Petits utilitaires
// ---------------------------------------------------------------------------
const $ = (sel, racine = document) => racine.querySelector(sel);
const $$ = (sel, racine = document) => [...racine.querySelectorAll(sel)];

function esc(texte) {
  return String(texte ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function versDate(iso) {
  if (!iso) return null;
  const [a, m, j] = iso.slice(0, 10).split("-").map(Number);
  return new Date(a, m - 1, j);
}
function aujourdhui() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isoDuJour(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function dateFr(iso) {
  const d = versDate(iso);
  return d ? d.toLocaleDateString("fr-FR") : "—";
}
function dateHeureFr(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR") + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function joursEntre(a, b) {
  return Math.round((b - a) / 86400000);
}

// ---------------------------------------------------------------------------
// Lecture de l'état
// ---------------------------------------------------------------------------
let E = null; // état courant (copie)
const rafraichirEtat = () => { E = Donnees.lire(); };

const nomResp = (id) => E.responsables.find((r) => r.id === id)?.nom ?? "?";
const libelleResponsables = (ids) => (ids?.length ? ids.map(nomResp).join(", ") : "À définir");

const actionsDe = (briqueId) =>
  E.actions.filter((a) => a.briqueId === briqueId).sort((a, b) => a.ordre - b.ordre);

const enRetard = (a) => a.statut !== "fait" && a.echeance && versDate(a.echeance) < aujourdhui();

function avancement(briqueId) {
  const acts = actionsDe(briqueId);
  const faites = acts.filter((a) => a.statut === "fait").length;
  return { faites, total: acts.length, pct: acts.length ? Math.round((faites / acts.length) * 100) : 0 };
}

function briquesTriees(statut) {
  return E.briques.filter((b) => !statut || b.statut === statut).sort((a, b) => a.ordre - b.ordre);
}

function libelleFin(b) {
  if (b.enContinu) return "En continu" + (b.fin ? ` (repère ${dateFr(b.fin)})` : "");
  return dateFr(b.fin);
}

// ---------------------------------------------------------------------------
// Petits morceaux d'interface
// ---------------------------------------------------------------------------
const pilulePriorite = (p) => `<span class="pilule prio prio--${p}">${PRIORITES[p]}</span>`;
const piluleStatutBrique = (s) => `<span class="pilule statut-b statut-b--${s}">${STATUTS_BRIQUE[s]}</span>`;
const piluleStatutAction = (s) => `<span class="pilule statut-a statut-a--${s}">${STATUTS_ACTION[s]}</span>`;
const piluleRetard = () => `<span class="pilule retard">En retard</span>`;
const options = (dico, choisi) =>
  Object.entries(dico).map(([v, l]) => `<option value="${v}" ${v === choisi ? "selected" : ""}>${l}</option>`).join("");

function barre(av) {
  return `<div class="avancement">
      <div class="progression progression--safe" role="progressbar" aria-valuenow="${av.pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${av.pct}%"></span></div>
      <span class="avancement-texte">${av.faites}/${av.total} action${av.total > 1 ? "s" : ""}</span>
    </div>`;
}

function toast(message) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("p");
    t.id = "toast";
    t.className = "bulle toast";
    t.setAttribute("role", "status");
    document.body.append(t);
  }
  t.textContent = message;
  t.classList.add("toast--visible");
  clearTimeout(toast.minuteur);
  toast.minuteur = setTimeout(() => t.classList.remove("toast--visible"), 2200);
}

// ---------------------------------------------------------------------------
// Glisser-déposer (avec une poignée ⠿)
// ---------------------------------------------------------------------------
function activerGlisser(liste, auDepot) {
  let enCours = null;

  liste.addEventListener("pointerdown", (e) => {
    const poignee = e.target.closest(".poignee");
    if (!poignee) return;
    const el = poignee.closest("[data-id]");
    el.draggable = true;
  });
  liste.addEventListener("dragstart", (e) => {
    enCours = e.target.closest("[data-id]");
    if (!enCours) return;
    enCours.classList.add("glisse");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", enCours.dataset.id);
  });
  liste.addEventListener("dragover", (e) => {
    if (!enCours) return;
    e.preventDefault();
    const cible = e.target.closest("[data-id]");
    if (!cible || cible === enCours || cible.parentElement !== liste) return;
    const r = cible.getBoundingClientRect();
    const apres = e.clientY > r.top + r.height / 2;
    liste.insertBefore(enCours, apres ? cible.nextSibling : cible);
  });
  liste.addEventListener("drop", (e) => e.preventDefault());
  liste.addEventListener("dragend", () => {
    if (!enCours) return;
    enCours.classList.remove("glisse");
    enCours.draggable = false;
    enCours = null;
    auDepot($$(":scope > [data-id]", liste).map((el) => el.dataset.id));
  });

  // Au clavier : flèches haut / bas sur la poignée
  liste.addEventListener("keydown", (e) => {
    const poignee = e.target.closest(".poignee");
    if (!poignee || !["ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const el = poignee.closest("[data-id]");
    const voisin = e.key === "ArrowUp" ? el.previousElementSibling : el.nextElementSibling;
    if (!voisin?.dataset.id) return;
    liste.insertBefore(el, e.key === "ArrowUp" ? voisin : voisin.nextSibling);
    poignee.focus();
    auDepot($$(":scope > [data-id]", liste).map((x) => x.dataset.id));
  });
}

const poignee = (libelle) =>
  `<button type="button" class="poignee" title="Glisser pour changer l'ordre (ou flèches ↑ ↓)" aria-label="Déplacer : ${esc(libelle)}">⠿</button>`;

// ---------------------------------------------------------------------------
// Choix des responsables (pilules à cocher)
// ---------------------------------------------------------------------------
function remplirChoixResponsables(conteneur, choisis) {
  const visibles = E.responsables.filter((r) => r.actif || choisis.includes(r.id));
  conteneur.innerHTML =
    visibles.map((r) => `
      <label class="choix-pilule">
        <input type="checkbox" value="${r.id}" ${choisis.includes(r.id) ? "checked" : ""}>
        <span>${esc(r.nom)}</span>
      </label>`).join("") +
    `<button type="button" class="bouton bouton--discret bouton--petit" data-ajout-resp>+ Ajouter</button>`;

  conteneur.querySelector("[data-ajout-resp]").onclick = async () => {
    const nom = prompt("Nom du nouveau responsable :");
    if (!nom || !nom.trim()) return;
    const coches = $$("input:checked", conteneur).map((i) => i.value);
    const resp = await Donnees.ajouterResponsable(nom);
    rafraichirEtat();
    remplirChoixResponsables(conteneur, [...coches, resp.id]);
  };
}
const lireChoixResponsables = (conteneur) => $$("input:checked", conteneur).map((i) => i.value);

// ---------------------------------------------------------------------------
// Fenêtres (dialog)
// ---------------------------------------------------------------------------
function ouvrirFenetre(dlg, auValider) {
  dlg.returnValue = "";
  dlg.showModal();
  dlg.onclose = async () => {
    const choix = dlg.returnValue;
    if (choix) await auValider(choix);
  };
}

function fenetreObjectif() {
  const dlg = $("#dlg-objectif");
  $("#f-ambition").value = E.objectif.ambition;
  $("#f-objectif-service").value = E.objectif.objectif;
  ouvrirFenetre(dlg, async (choix) => {
    if (choix !== "valider") return;
    await Donnees.majObjectif({
      ambition: $("#f-ambition").value.trim(),
      objectif: $("#f-objectif-service").value.trim(),
    });
    toast("Objectif mis à jour");
    afficher();
  });
}

function fenetreBrique(brique, statutParDefaut = "a-ouvrir") {
  const dlg = $("#dlg-brique");
  const b = brique ?? { nom: "", objectif: "", responsables: [], statut: statutParDefaut, priorite: "moyenne",
    debut: null, fin: null, enContinu: false, moyens: "" };
  $("#dlg-brique-titre").textContent = brique ? "Modifier la brique" : "Nouvelle brique";
  $("#f-b-nom").value = b.nom;
  $("#f-b-objectif").value = b.objectif;
  $("#f-b-statut").innerHTML = options(STATUTS_BRIQUE, b.statut);
  $("#f-b-priorite").innerHTML = options(PRIORITES, b.priorite);
  $("#f-b-debut").value = b.debut ?? "";
  $("#f-b-fin").value = b.fin ?? "";
  $("#f-b-continu").checked = !!b.enContinu;
  $("#f-b-moyens").value = b.moyens;
  $("#dlg-brique-erreur").hidden = true;
  remplirChoixResponsables($('[data-responsables="brique"]'), b.responsables);

  // Vérification avant fermeture : une brique ouverte a besoin de dates cohérentes
  const form = $("form", dlg);
  form.onsubmit = (e) => {
    if (e.submitter?.value !== "valider") return;
    const statut = $("#f-b-statut").value, debut = $("#f-b-debut").value, fin = $("#f-b-fin").value;
    let erreur = "";
    if (statut !== "a-ouvrir" && (!debut || !fin)) erreur = "Pour ouvrir la brique, indique une date de début et une date de fin.";
    else if (debut && fin && fin < debut) erreur = "La date de fin arrive avant la date de début.";
    if (erreur) {
      e.preventDefault();
      $("#dlg-brique-erreur").textContent = erreur;
      $("#dlg-brique-erreur").hidden = false;
    }
  };

  ouvrirFenetre(dlg, async (choix) => {
    if (choix !== "valider") return;
    const champs = {
      nom: $("#f-b-nom").value.trim(),
      objectif: $("#f-b-objectif").value.trim(),
      responsables: lireChoixResponsables($('[data-responsables="brique"]')),
      statut: $("#f-b-statut").value,
      priorite: $("#f-b-priorite").value,
      debut: $("#f-b-debut").value || null,
      fin: $("#f-b-fin").value || null,
      enContinu: $("#f-b-continu").checked,
      moyens: $("#f-b-moyens").value.trim(),
    };
    if (brique) {
      await Donnees.majBrique(brique.id, champs);
      toast("Brique enregistrée");
      afficher();
    } else {
      const nouvelle = await Donnees.creerBrique(champs);
      toast("Brique créée");
      location.hash = `#/brique/${nouvelle.id}`;
    }
  });
}

function fenetreAction(briqueId, action) {
  const dlg = $("#dlg-action");
  const a = action ?? { intitule: "", responsables: [], note: "", echeance: null, statut: "a-faire", priorite: "moyenne", commentaire: "" };
  $("#dlg-action-titre").textContent = action ? "Modifier l'action" : "Nouvelle action";
  $("#f-a-intitule").value = a.intitule;
  $("#f-a-note").value = a.note;
  $("#f-a-echeance").value = a.echeance ?? "";
  $("#f-a-statut").innerHTML = options(STATUTS_ACTION, a.statut);
  $("#f-a-priorite").innerHTML = options(PRIORITES, a.priorite);
  $("#f-a-commentaire").value = a.commentaire;
  $("#dlg-action-supprimer").hidden = !action;
  remplirChoixResponsables($('[data-responsables="action"]'), a.responsables);
  $("form", dlg).onsubmit = null;

  ouvrirFenetre(dlg, async (choix) => {
    if (choix === "supprimer") {
      if (!confirm(`Supprimer l'action « ${a.intitule} » ?`)) return;
      await Donnees.supprimerAction(action.id);
      toast("Action supprimée");
      return afficher();
    }
    if (choix !== "valider") return;
    const champs = {
      intitule: $("#f-a-intitule").value.trim(),
      responsables: lireChoixResponsables($('[data-responsables="action"]')),
      note: $("#f-a-note").value.trim(),
      echeance: $("#f-a-echeance").value || null,
      statut: $("#f-a-statut").value,
      priorite: $("#f-a-priorite").value,
      commentaire: $("#f-a-commentaire").value.trim(),
    };
    if (action) await Donnees.majAction(action.id, champs);
    else await Donnees.creerAction(briqueId, champs);
    toast("Action enregistrée");
    afficher();
  });
}

// ---------------------------------------------------------------------------
// Écran 1 — Feuille de route
// ---------------------------------------------------------------------------
function bandeauObjectif() {
  const o = E.objectif;
  const maj = o.modifiePar ? `<p class="texte-doux petit">Mis à jour par ${esc(o.modifiePar)} le ${dateHeureFr(o.modifieLe)}</p>` : "";
  return `
    <section class="carte bandeau-objectif">
      <div class="bandeau-objectif-texte">
        <p class="accroche bandeau-titre">Notre cap</p>
        <p><strong>Ambition :</strong> ${esc(o.ambition)}</p>
        <p><strong>Objectif :</strong> ${esc(o.objectif)}</p>
        ${maj}
      </div>
      <button class="bouton bouton--secondaire bouton--petit" data-action="modifier-objectif">Modifier</button>
    </section>`;
}

function carteBrique(b) {
  const av = avancement(b.id);
  const retards = actionsDe(b.id).filter(enRetard).length;
  const bloquees = actionsDe(b.id).filter((a) => a.statut === "bloque").length;
  const dates = b.debut ? `${dateFr(b.debut)} → ${libelleFin(b)}` : "Dates à définir";
  return `
    <article class="carte carte-brique carte-brique--${b.statut}" data-id="${b.id}">
      ${poignee(b.nom)}
      <a class="carte-brique-corps" href="#/brique/${b.id}">
        <div class="ligne">
          <h3>${esc(b.nom)}</h3>
          ${pilulePriorite(b.priorite)}
          ${b.statut !== "ouverte" ? piluleStatutBrique(b.statut) : ""}
          ${retards ? `<span class="pilule retard">${retards} en retard</span>` : ""}
          ${bloquees ? `<span class="pilule statut-a statut-a--bloque">${bloquees} bloquée${bloquees > 1 ? "s" : ""}</span>` : ""}
        </div>
        <p class="texte-doux petit">${esc(libelleResponsables(b.responsables))} · ${dates}</p>
        ${b.statut === "a-ouvrir" ? "" : barre(av)}
      </a>
    </article>`;
}

function ecranAccueil() {
  const ouvertes = briquesTriees("ouverte");
  const aOuvrir = briquesTriees("a-ouvrir");
  const terminees = briquesTriees("terminee");

  $("#vue").innerHTML = `
    ${bandeauObjectif()}

    <section class="section-app">
      <div class="ligne entete-section">
        <h2>Briques ouvertes <span class="badge badge--doux">${ouvertes.length}</span></h2>
        <span class="espace-flex"></span>
        <button class="bouton bouton--petit" data-action="nouvelle-brique" data-statut="ouverte">+ Nouvelle brique</button>
      </div>
      <div class="liste-briques" id="liste-ouvertes">
        ${ouvertes.map(carteBrique).join("") || `<p class="texte-doux">Aucune brique ouverte pour l'instant.</p>`}
      </div>
    </section>

    <section class="section-app">
      <div class="ligne entete-section">
        <h2>Chantiers à venir <span class="badge badge--doux">${aOuvrir.length}</span></h2>
        <span class="espace-flex"></span>
        <button class="bouton bouton--secondaire bouton--petit" data-action="nouvelle-brique" data-statut="a-ouvrir">+ Chantier à venir</button>
      </div>
      <div class="liste-briques" id="liste-a-ouvrir">
        ${aOuvrir.map(carteBrique).join("") || `<p class="texte-doux">Rien en attente.</p>`}
      </div>
    </section>

    <details class="section-app">
      <summary><h2>Briques terminées <span class="badge badge--doux">${terminees.length}</span></h2></summary>
      <div class="liste-briques" id="liste-terminees">
        ${terminees.map(carteBrique).join("") || `<p class="texte-doux">Pas encore de brique terminée. Ça viendra !</p>`}
      </div>
    </details>`;

  for (const id of ["liste-ouvertes", "liste-a-ouvrir", "liste-terminees"]) {
    const liste = document.getElementById(id);
    activerGlisser(liste, async (ids) => {
      // On garde l'ordre global : ouvertes, puis à ouvrir, puis terminées
      const ordre = ["liste-ouvertes", "liste-a-ouvrir", "liste-terminees"]
        .flatMap((l) => $$(`#${l} > [data-id]`).map((el) => el.dataset.id));
      await Donnees.reordonnerBriques(ordre);
      rafraichirEtat();
      toast("Ordre enregistré");
    });
  }
}

// ---------------------------------------------------------------------------
// Écran 2 — Fiche brique
// ---------------------------------------------------------------------------
let ongletBrique = "actions";

function ligneAction(a) {
  const retard = enRetard(a);
  return `
    <li class="action ${retard ? "action--retard" : ""} action--${a.statut}" data-id="${a.id}">
      ${poignee(a.intitule)}
      <div class="action-corps">
        <p class="action-intitule">${esc(a.intitule)}</p>
        <p class="texte-doux petit">
          ${esc(libelleResponsables(a.responsables))}${a.note ? ` · <em>${esc(a.note)}</em>` : ""}
          · échéance <strong class="${retard ? "texte-rouge" : ""}">${dateFr(a.echeance)}</strong>
        </p>
        ${a.commentaire ? `<p class="action-commentaire">💬 ${esc(a.commentaire)}</p>` : ""}
      </div>
      <div class="action-reglages">
        ${retard ? piluleRetard() : ""}
        <select class="select-pilule statut-a--${a.statut}" data-champ="statut" aria-label="Statut">${options(STATUTS_ACTION, a.statut)}</select>
        <select class="select-pilule prio--${a.priorite}" data-champ="priorite" aria-label="Priorité">${options(PRIORITES, a.priorite)}</select>
        <button class="bouton bouton--discret bouton--petit" data-action="modifier-action">Modifier</button>
      </div>
    </li>`;
}

function libelleValeur(champ, v) {
  if (v === null || v === undefined || v === "") return "—";
  if (champ === "statut") return STATUTS_ACTION[v] ?? STATUTS_BRIQUE[v] ?? v;
  if (champ === "priorite") return PRIORITES[v] ?? v;
  if (champ === "enContinu") return v ? "Oui" : "Non";
  if (["debut", "fin", "echeance"].includes(champ)) return dateFr(v);
  return v;
}

function ligneHistorique(h) {
  const action = h.actionId ? E.actions.find((a) => a.id === h.actionId) : null;
  const sujet = action ? `Action « ${esc(action.intitule)} »` : h.actionId ? "Action supprimée depuis" : "Brique";
  let quoi;
  if (h.champ === "creation") quoi = h.actionId ? `${sujet} : création` : "Création de la brique";
  else if (h.champ === "suppression") quoi = `Suppression de l'action « ${esc(h.avant)} »`;
  else quoi = `${sujet} : ${Donnees.CHAMPS_SUIVIS[h.champ] ?? h.champ}
      <span class="texte-doux">${esc(libelleValeur(h.champ, h.avant))}</span> → <strong>${esc(libelleValeur(h.champ, h.apres))}</strong>`;
  return `<li><span class="historique-date">${dateHeureFr(h.date)} · ${esc(h.auteur)}</span><span>${quoi}</span></li>`;
}

function ecranBrique(id) {
  const b = E.briques.find((x) => x.id === id);
  if (!b) {
    $("#vue").innerHTML = `<p class="alerte">Cette brique n'existe pas (ou plus). <a href="#/">Retour à la feuille de route</a></p>`;
    return;
  }
  const acts = actionsDe(id);
  const histo = E.historique.filter((h) => h.briqueId === id);
  const av = avancement(id);

  $("#vue").innerHTML = `
    <p><a href="#/">← Feuille de route</a></p>
    <section class="carte fiche-brique carte-brique--${b.statut}">
      <div class="ligne">
        <h1 class="titre-brique">${esc(b.nom)}</h1>
        ${piluleStatutBrique(b.statut)} ${pilulePriorite(b.priorite)}
      </div>
      <dl class="fiche-infos">
        <div><dt>Objectif</dt><dd>${esc(b.objectif) || "<span class='texte-doux'>À préciser</span>"}</dd></div>
        <div><dt>Responsable(s)</dt><dd>${esc(libelleResponsables(b.responsables))}</dd></div>
        <div><dt>Début</dt><dd>${dateFr(b.debut)}</dd></div>
        <div><dt>Fin</dt><dd>${esc(libelleFin(b))}</dd></div>
        <div class="fiche-large"><dt>Moyens et ressources</dt><dd>${esc(b.moyens) || "<span class='texte-doux'>À préciser</span>"}</dd></div>
      </dl>
      ${b.statut !== "a-ouvrir" ? barre(av) : ""}
      <div class="ligne fiche-boutons">
        <button class="bouton bouton--secondaire bouton--petit" data-action="modifier-brique">Modifier</button>
        ${b.statut === "a-ouvrir" ? `<button class="bouton bouton--petit" data-action="ouvrir-brique">Ouvrir la brique</button>` : ""}
        ${b.statut === "ouverte" ? `<button class="bouton bouton--sombre bouton--petit" data-action="cloturer-brique">Clôturer la brique</button>` : ""}
        ${b.statut === "terminee" ? `<button class="bouton bouton--secondaire bouton--petit" data-action="rouvrir-brique">Rouvrir</button>` : ""}
        <span class="espace-flex"></span>
        <button class="bouton bouton--discret bouton--petit texte-rouge" data-action="supprimer-brique">Supprimer</button>
      </div>
    </section>

    <div class="onglets" role="tablist">
      <button role="tab" class="onglet" aria-selected="${ongletBrique === "actions"}" data-onglet="actions">Actions <span class="badge badge--doux">${acts.length}</span></button>
      <button role="tab" class="onglet" aria-selected="${ongletBrique === "historique"}" data-onglet="historique">Historique <span class="badge badge--doux">${histo.length}</span></button>
    </div>

    <section ${ongletBrique === "actions" ? "" : "hidden"}>
      <div class="ligne entete-section">
        <button class="bouton bouton--petit" data-action="nouvelle-action">+ Nouvelle action</button>
        <span class="espace-flex"></span>
        ${acts.length > 1 ? `<button class="bouton bouton--discret bouton--petit" data-action="trier-priorite">Trier par priorité puis échéance</button>` : ""}
      </div>
      <ul class="liste-actions" id="liste-actions">
        ${acts.map(ligneAction).join("") || `<li class="texte-doux vide">Pas encore d'action. Ajoute la première !</li>`}
      </ul>
    </section>

    <section ${ongletBrique === "historique" ? "" : "hidden"}>
      <ul class="historique">
        ${histo.map(ligneHistorique).join("") || `<li class="texte-doux vide">Aucun changement enregistré pour l'instant.</li>`}
      </ul>
    </section>`;

  activerGlisser($("#liste-actions"), async (ids) => {
    await Donnees.reordonnerActions(id, ids);
    rafraichirEtat();
    toast("Ordre enregistré");
  });

  // Changement rapide de statut / priorité
  $("#liste-actions").addEventListener("change", async (e) => {
    const sel = e.target.closest("select[data-champ]");
    if (!sel) return;
    const actionId = sel.closest("[data-id]").dataset.id;
    await Donnees.majAction(actionId, { [sel.dataset.champ]: sel.value });
    toast(sel.dataset.champ === "statut" && sel.value === "fait" ? "Bravo, une de plus ! 🎉" : "Enregistré");
    afficher();
  });
}

// ---------------------------------------------------------------------------
// Écran 3 — Synthèse
// ---------------------------------------------------------------------------
let filtreResp = "tous";

function concerne(item) {
  return filtreResp === "tous" || (item.responsables ?? []).includes(filtreResp);
}
function briqueConcernee(b) {
  return filtreResp === "tous" || concerne(b) || actionsDe(b.id).some(concerne);
}

function gantt(briques) {
  const datees = briques.filter((b) => b.debut && b.fin);
  const auj = aujourdhui();
  if (!datees.length) return `<p class="texte-doux">Aucune brique datée à afficher.</p>`;

  const minD = new Date(Math.min(auj, ...datees.map((b) => versDate(b.debut))));
  const maxD = new Date(Math.max(auj, ...datees.map((b) => versDate(b.fin))));
  const debut = new Date(minD.getFullYear(), minD.getMonth(), 1);
  const fin = new Date(maxD.getFullYear(), maxD.getMonth() + 1, 0);
  const total = joursEntre(debut, fin) + 1;
  const pos = (d) => (joursEntre(debut, d) / total) * 100;

  // Mois
  const mois = [];
  for (let d = new Date(debut); d <= fin; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const finMois = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    mois.push({ d, gauche: pos(d), largeur: ((joursEntre(d, finMois) + 1) / total) * 100 });
  }
  const separateurs = mois.slice(1).map((m) => `<span class="gantt-sep" style="left:${m.gauche}%"></span>`).join("");
  const entete = mois.map((m) => {
    const lib = m.d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");
    const annee = m.d.getMonth() === 0 || m === mois[0] ? `<small>${m.d.getFullYear()}</small>` : "";
    return `<span class="gantt-mois" style="left:${m.gauche}%;width:${m.largeur}%">${lib}${annee}</span>`;
  }).join("");

  const lignes = datees.map((b) => {
    const g = pos(versDate(b.debut));
    const l = ((joursEntre(versDate(b.debut), versDate(b.fin)) + 1) / total) * 100;
    const av = avancement(b.id);
    const retards = actionsDe(b.id).filter(enRetard).length;
    const titre = `${b.nom} — ${dateFr(b.debut)} → ${libelleFin(b)} — ${STATUTS_BRIQUE[b.statut]} — ${av.faites}/${av.total} actions faites`;
    return `
      <div class="gantt-ligne">
        <a class="gantt-nom" href="#/brique/${b.id}">${esc(b.nom)}</a>
        <div class="gantt-piste">
          ${separateurs}
          <a href="#/brique/${b.id}" class="gantt-barre gantt-barre--${b.statut} ${b.enContinu ? "gantt-barre--continu" : ""}"
             style="left:${g}%;width:${l}%" title="${esc(titre)}">
            <span class="gantt-rempli" style="width:${b.statut === "a-ouvrir" ? 0 : av.pct}%"></span>
            <span class="gantt-texte">${av.total ? `${av.faites}/${av.total}` : ""}${retards ? " ⚠" : ""}</span>
          </a>
        </div>
      </div>`;
  }).join("");

  const ajd = pos(auj);
  return `
    <div class="gantt-defile">
      <div class="gantt">
        <div class="gantt-ligne gantt-entete"><span class="gantt-nom"></span><div class="gantt-piste">${entete}</div></div>
        ${lignes}
        <div class="gantt-calque" aria-hidden="true">
          <span class="gantt-nom"></span>
          <div class="gantt-piste gantt-piste--calque">
            <span class="gantt-aujourdhui" style="left:${ajd}%"><span>Aujourd'hui</span></span>
          </div>
        </div>
      </div>
    </div>
    <p class="legende ligne petit">
      <span class="legende-pastille gantt-barre--ouverte"></span> Ouverte
      <span class="legende-pastille gantt-barre--terminee"></span> Terminée
      <span class="legende-pastille gantt-barre--a-ouvrir"></span> À ouvrir
      <span class="legende-pastille legende-rempli"></span> Part des actions faites
      · ⚠ actions en retard
    </p>`;
}

function listeActionsSynthese(actions, vide) {
  if (!actions.length) return `<p class="texte-doux">${vide}</p>`;
  return `<ul class="liste-synthese">${actions.map((a) => {
    const b = E.briques.find((x) => x.id === a.briqueId);
    return `<li>
      <a href="#/brique/${a.briqueId}">${esc(a.intitule)}</a>
      <span class="texte-doux petit">${esc(b?.nom)} · ${esc(libelleResponsables(a.responsables))} · ${dateFr(a.echeance)}</span>
      <span class="ligne">${enRetard(a) ? piluleRetard() : ""} ${piluleStatutAction(a.statut)} ${pilulePriorite(a.priorite)}</span>
      ${a.commentaire ? `<span class="action-commentaire">💬 ${esc(a.commentaire)}</span>` : ""}
    </li>`;
  }).join("")}</ul>`;
}

function ecranSynthese() {
  const auj = aujourdhui();
  const dans30 = new Date(auj); dans30.setDate(dans30.getDate() + 30);
  const briquesF = briquesTriees().filter(briqueConcernee);
  const ouvertes = briquesTriees("ouverte").filter(briqueConcernee);
  const actionsActives = E.actions.filter((a) => {
    const b = E.briques.find((x) => x.id === a.briqueId);
    return b && b.statut !== "terminee" && concerne(a);
  });
  const parEcheance = (x, y) => (x.echeance ?? "9999").localeCompare(y.echeance ?? "9999") || RANG_PRIORITE[x.priorite] - RANG_PRIORITE[y.priorite];
  const alertes = actionsActives.filter((a) => enRetard(a) || a.statut === "bloque").sort(parEcheance);
  const prochaines = actionsActives
    .filter((a) => a.statut !== "fait" && a.echeance && !enRetard(a) && versDate(a.echeance) <= dans30)
    .sort(parEcheance);
  const aPlanifier = briquesF.filter((b) => b.statut === "a-ouvrir");

  const resps = E.responsables.filter((r) => r.actif);
  $("#vue").innerHTML = `
    <div class="ligne entete-section">
      <h1>Synthèse</h1>
      <span class="espace-flex"></span>
      <span class="texte-doux">au ${auj.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
      <button class="bouton bouton--secondaire bouton--petit sans-impression" onclick="window.print()">Imprimer / PDF</button>
    </div>

    <div class="ligne filtres" role="group" aria-label="Filtrer par responsable">
      <span class="texte-doux petit">Responsable :</span>
      <button class="filtre" aria-pressed="${filtreResp === "tous"}" data-filtre="tous">Tous</button>
      ${resps.map((r) => `<button class="filtre" aria-pressed="${filtreResp === r.id}" data-filtre="${r.id}">${esc(r.nom)}</button>`).join("")}
    </div>

    <section class="carte section-synthese">
      <h2>La frise des briques</h2>
      ${gantt(briquesF)}
      ${aPlanifier.length ? `<p class="petit"><strong>À planifier :</strong> ${aPlanifier.map((b) => `<a class="pilule statut-b statut-b--a-ouvrir" href="#/brique/${b.id}">${esc(b.nom)}</a>`).join(" ")}</p>` : ""}
    </section>

    <section class="carte section-synthese">
      <h2>Où en sont les briques ouvertes&nbsp;?</h2>
      ${ouvertes.length ? `<ul class="liste-avancement">${ouvertes.map((b) => `
        <li>
          <a href="#/brique/${b.id}"><strong>${esc(b.nom)}</strong></a>
          <span class="texte-doux petit">${esc(libelleResponsables(b.responsables))} · ${b.enContinu ? "en continu" : `jusqu'au ${dateFr(b.fin)}`}</span>
          ${barre(avancement(b.id))}
        </li>`).join("")}</ul>` : `<p class="texte-doux">Aucune brique ouverte pour ce filtre.</p>`}
    </section>

    <div class="grille grille--2 grille-synthese">
      <section class="carte section-synthese">
        <h2>En retard ou bloquées <span class="badge ${alertes.length ? "" : "badge--doux"}">${alertes.length}</span></h2>
        ${alertes.length ? listeActionsSynthese(alertes, "") : `
          <div class="vide-heureux">
            <img src="../assets/mascotte/aply-zen.webp" alt="Aply, la mascotte ID.Quation, médite tranquillement">
            <p>Rien en retard, rien de bloqué. On respire&nbsp;!</p>
          </div>`}
      </section>
      <section class="carte section-synthese">
        <h2>Dans les 30 prochains jours <span class="badge badge--doux">${prochaines.length}</span></h2>
        ${listeActionsSynthese(prochaines, "Aucune échéance dans les 30 prochains jours.")}
      </section>
    </div>`;

  $$(".filtre").forEach((btn) => btn.addEventListener("click", () => {
    filtreResp = btn.dataset.filtre;
    ecranSynthese();
  }));
}

// ---------------------------------------------------------------------------
// Écran 4 — Responsables
// ---------------------------------------------------------------------------
function ecranResponsables() {
  const compte = (id) => ({
    briques: E.briques.filter((b) => b.responsables.includes(id)).length,
    actions: E.actions.filter((a) => a.responsables.includes(id)).length,
  });
  $("#vue").innerHTML = `
    <h1>Responsables</h1>
    <p class="texte-doux">La liste des personnes à qui on peut confier une brique ou une action. Une personne retirée de la liste reste visible sur ce qui lui était déjà confié.</p>
    <form class="carte ligne" id="form-resp">
      <label class="sr-only" for="nouveau-resp">Nom</label>
      <input id="nouveau-resp" class="saisie saisie--flex" placeholder="Nom (ex. Comptable, Cécile…)" required>
      <button class="bouton">Ajouter</button>
    </form>
    <ul class="liste-resp">
      ${E.responsables.map((r) => {
        const c = compte(r.id);
        return `<li class="carte ligne ${r.actif ? "" : "resp--inactif"}" data-id="${r.id}">
          <span class="avatar">${esc(r.nom.charAt(0).toUpperCase())}</span>
          <strong>${esc(r.nom)}</strong>
          <span class="texte-doux petit">${c.briques} brique${c.briques > 1 ? "s" : ""} · ${c.actions} action${c.actions > 1 ? "s" : ""}</span>
          <span class="espace-flex"></span>
          <button class="bouton bouton--discret bouton--petit" data-action="renommer-resp">Renommer</button>
          <button class="bouton bouton--secondaire bouton--petit" data-action="basculer-resp">${r.actif ? "Retirer de la liste" : "Remettre dans la liste"}</button>
        </li>`;
      }).join("")}
    </ul>`;

  $("#form-resp").addEventListener("submit", async (e) => {
    e.preventDefault();
    await Donnees.ajouterResponsable($("#nouveau-resp").value);
    toast("Responsable ajouté");
    afficher();
  });
}

// ---------------------------------------------------------------------------
// Clics délégués
// ---------------------------------------------------------------------------
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-action], [data-onglet]");
  if (!btn) return;

  if (btn.dataset.onglet) {
    ongletBrique = btn.dataset.onglet;
    return afficher();
  }

  const route = routeCourante();
  const brique = route.nom === "brique" ? E.briques.find((b) => b.id === route.id) : null;

  switch (btn.dataset.action) {
    case "modifier-objectif": return fenetreObjectif();
    case "nouvelle-brique": return fenetreBrique(null, btn.dataset.statut);
    case "modifier-brique": return fenetreBrique(brique);
    case "ouvrir-brique":
      return fenetreBrique({ ...brique, statut: "ouverte", debut: brique.debut ?? isoDuJour(aujourdhui()) });
    case "cloturer-brique": {
      const reste = actionsDe(brique.id).filter((a) => a.statut !== "fait").length;
      const msg = reste
        ? `Il reste ${reste} action${reste > 1 ? "s" : ""} non faite${reste > 1 ? "s" : ""}. Clôturer quand même la brique ?`
        : "Toutes les actions sont faites. Clôturer la brique ?";
      if (!confirm(msg)) return;
      await Donnees.majBrique(brique.id, { statut: "terminee" });
      toast("Brique clôturée. Beau travail ! 🎉");
      return afficher();
    }
    case "rouvrir-brique":
      await Donnees.majBrique(brique.id, { statut: "ouverte" });
      return afficher();
    case "supprimer-brique":
      if (!confirm(`Supprimer définitivement la brique « ${brique.nom} », ses actions et son historique ?\n\nPour une brique finie, préfère « Clôturer ».`)) return;
      await Donnees.supprimerBrique(brique.id);
      toast("Brique supprimée");
      location.hash = "#/";
      return;
    case "nouvelle-action": return fenetreAction(brique.id, null);
    case "modifier-action": {
      const action = E.actions.find((a) => a.id === btn.closest("[data-id]").dataset.id);
      return fenetreAction(action.briqueId, action);
    }
    case "trier-priorite": {
      const ids = actionsDe(brique.id)
        .sort((a, b) => RANG_PRIORITE[a.priorite] - RANG_PRIORITE[b.priorite] || (a.echeance ?? "9999").localeCompare(b.echeance ?? "9999"))
        .map((a) => a.id);
      await Donnees.reordonnerActions(brique.id, ids);
      toast("Actions triées");
      return afficher();
    }
    case "renommer-resp": {
      const r = E.responsables.find((x) => x.id === btn.closest("[data-id]").dataset.id);
      const nom = prompt("Nouveau nom :", r.nom);
      if (!nom || !nom.trim()) return;
      await Donnees.majResponsable(r.id, { nom: nom.trim() });
      return afficher();
    }
    case "basculer-resp": {
      const r = E.responsables.find((x) => x.id === btn.closest("[data-id]").dataset.id);
      await Donnees.majResponsable(r.id, { actif: !r.actif });
      if (filtreResp === r.id) filtreResp = "tous";
      return afficher();
    }
  }
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function routeCourante() {
  const morceaux = location.hash.replace(/^#\/?/, "").split("/");
  if (morceaux[0] === "brique" && morceaux[1]) return { nom: "brique", id: morceaux[1] };
  if (["synthese", "responsables"].includes(morceaux[0])) return { nom: morceaux[0] };
  return { nom: "accueil" };
}

function afficher() {
  rafraichirEtat();
  const route = routeCourante();
  $$("[data-nav]").forEach((a) =>
    a.toggleAttribute("aria-current", a.dataset.nav === route.nom || (route.nom === "brique" && a.dataset.nav === "accueil")));
  if (route.nom === "brique") ecranBrique(route.id);
  else if (route.nom === "synthese") ecranSynthese();
  else if (route.nom === "responsables") ecranResponsables();
  else ecranAccueil();
}

let derniereRoute = "";
window.addEventListener("hashchange", () => {
  const r = routeCourante();
  const cle = r.nom + (r.id ?? "");
  if (cle !== derniereRoute) { ongletBrique = "actions"; window.scrollTo(0, 0); }
  derniereRoute = cle;
  afficher();
});

// ---------------------------------------------------------------------------
// Démarrage
// ---------------------------------------------------------------------------
(async function demarrer() {
  await Donnees.charger();
  rafraichirEtat();

  const choix = $("#choix-utilisateur");
  choix.innerHTML = E.utilisateurs.map((u) => `<option ${u === Donnees.utilisateurCourant() ? "selected" : ""}>${esc(u)}</option>`).join("");
  choix.addEventListener("change", async () => {
    await Donnees.changerUtilisateur(choix.value);
    toast(`Bonjour ${choix.value} !`);
  });

  $("#pilule-demo").hidden = Donnees.mode !== "demo";
  $("#reinitialiser").hidden = Donnees.mode !== "demo";
  $("#reinitialiser").addEventListener("click", async () => {
    if (!confirm("Remettre les données de départ ? Toutes les modifications faites dans ce navigateur seront effacées.")) return;
    await Donnees.reinitialiser();
    toast("Données de départ rechargées");
    afficher();
  });

  derniereRoute = routeCourante().nom + (routeCourante().id ?? "");
  afficher();
})();
