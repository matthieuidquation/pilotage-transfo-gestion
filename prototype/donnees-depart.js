// Données de départ de la feuille de route du service gestion.
// Chargées au premier lancement (ou après « Réinitialiser la démo »).
// Responsables : r-matthieu, r-louba, r-stephanie, r-cecile, r-assistantes, r-rba.

window.DONNEES_DEPART = {
  version: 1,

  utilisateurs: ["Matthieu", "Louba"],

  objectif: {
    ambition:
      "Transformer durablement le fonctionnement du service gestion, avec une trajectoire claire pour 2027.",
    objectif:
      "Un service moins absorbé par l'opérationnel, avec des responsabilités claires, des processus clairs et des contrôles proportionnés.",
    modifiePar: null,
    modifieLe: null,
  },

  responsables: [
    { id: "r-matthieu", nom: "Matthieu", actif: true },
    { id: "r-louba", nom: "Louba", actif: true },
    { id: "r-stephanie", nom: "Stéphanie", actif: true },
    { id: "r-cecile", nom: "Cécile", actif: true },
    { id: "r-assistantes", nom: "Assistantes de formation", actif: true },
    { id: "r-rba", nom: "RBA", actif: true },
  ],

  briques: [
    {
      id: "b1", ordre: 1, statut: "ouverte", priorite: "haute",
      nom: "Actions rapides",
      objectif:
        "Alléger tout de suite le poste de Stéphanie, en confiant certaines tâches aux bonnes personnes, et clarifier les circuits d'achat et de validation.",
      responsables: ["r-matthieu", "r-louba"],
      debut: "2026-11-01", fin: "2026-12-31", enContinu: false,
      moyens:
        "Temps de passation avec Cécile et les assistantes de formation, information des équipes, validation de Matthieu sur le processus achat et la délégation de signature.",
    },
    {
      id: "b2", ordre: 2, statut: "ouverte", priorite: "haute",
      nom: "Tâches récurrentes et place pour l'imprévu",
      objectif:
        "Connaître le temps réel de chaque mission, garder une marge pour l'imprévu, repérer les pertes de temps.",
      responsables: ["r-louba"],
      debut: "2026-11-01", fin: "2027-01-31", enContinu: false,
      moyens: "Temps de Louba et Stéphanie, modèle de cartographie commun, arbitrages de Matthieu.",
    },
    {
      id: "b3", ordre: 3, statut: "ouverte", priorite: "haute",
      nom: "Fiabiliser les reportings",
      objectif: "Disposer chaque mois d'un reporting fiable, lisible et rapproché de la comptabilité.",
      responsables: ["r-louba"],
      debut: "2027-01-01", fin: "2027-03-31", enContinu: false,
      moyens:
        "Accompagnement RBA, formation si besoin (contrôle de gestion, Excel, IA), temps de Matthieu pour les indicateurs.",
    },
    {
      id: "b4", ordre: 4, statut: "ouverte", priorite: "moyenne",
      nom: "Ritualiser le management",
      objectif: "Installer un cadre régulier pour suivre la charge, le travail et le climat du service.",
      responsables: ["r-louba", "r-matthieu"],
      debut: "2026-12-01", fin: "2027-12-31", enContinu: true,
      moyens: "Temps de Louba, Stéphanie et Matthieu, tableau des tâches Teams existant.",
    },
    {
      id: "b5", ordre: 5, statut: "a-ouvrir", priorite: "moyenne",
      nom: "Règles de contrôle des notes de frais",
      objectif: "", responsables: [], debut: null, fin: null, enContinu: false, moyens: "",
    },
    {
      id: "b6", ordre: 6, statut: "a-ouvrir", priorite: "moyenne",
      nom: "Procédures écrites des missions de Stéphanie",
      objectif: "", responsables: [], debut: null, fin: null, enContinu: false, moyens: "",
    },
    {
      id: "b7", ordre: 7, statut: "a-ouvrir", priorite: "moyenne",
      nom: "Outils : Dendreo, automatisation Lucca → Silae, outil de reporting",
      objectif: "", responsables: [], debut: null, fin: null, enContinu: false, moyens: "",
    },
  ],

  actions: [
    // Brique 1 — Actions rapides
    { id: "a1", briqueId: "b1", ordre: 1, intitule: "Confier les courses du siège à Cécile",
      responsables: ["r-matthieu"], note: "", echeance: "2026-12-31" },
    { id: "a2", briqueId: "b1", ordre: 2, intitule: "Confier la validation des factures de sous-traitance aux assistantes de formation",
      responsables: ["r-matthieu"], note: "", echeance: "2026-12-31" },
    { id: "a3", briqueId: "b1", ordre: 3, intitule: "Formaliser le processus achat et contrôle interne : validation des devis, politique de déplacement, circuit de validation des factures, délégation de signature",
      responsables: ["r-louba", "r-matthieu"], note: "Matthieu valide", echeance: "2026-12-31" },

    // Brique 2 — Tâches récurrentes et place pour l'imprévu
    { id: "a4", briqueId: "b2", ordre: 1, intitule: "Lister les missions récurrentes de Louba et Stéphanie : temps, fréquence, cible, risques, responsable",
      responsables: ["r-louba", "r-stephanie"], note: "", echeance: "2026-12-31" },
    { id: "a5", briqueId: "b2", ordre: 2, intitule: "Mesurer la part de temps prise par l'imprévu",
      responsables: ["r-louba"], note: "", echeance: "2026-12-31" },
    { id: "a6", briqueId: "b2", ordre: 3, intitule: "Identifier les missions qui peuvent revenir à Stéphanie",
      responsables: ["r-louba", "r-matthieu"], note: "Matthieu arbitre", echeance: "2026-12-31" },
    { id: "a7", briqueId: "b2", ordre: 4, intitule: "Construire l'agenda Outlook comme une to-do list quotidienne : tâches récurrentes planifiées, créneaux gardés pour l'imprévu",
      responsables: ["r-louba", "r-stephanie"], note: "", echeance: "2026-12-31" },
    { id: "a8", briqueId: "b2", ordre: 5, intitule: "En tirer une feuille de route d'optimisation (IA, outils existants et en déploiement)",
      responsables: ["r-louba"], note: "", echeance: "2027-01-31" },

    // Brique 3 — Fiabiliser les reportings
    { id: "a9", briqueId: "b3", ordre: 1, intitule: "Définir les indicateurs de pilotage : CA et marge par client, produit, commercial",
      responsables: ["r-matthieu", "r-louba"], note: "", echeance: "2027-01-31" },
    { id: "a10", briqueId: "b3", ordre: 2, intitule: "Produire une situation comptable mensuelle",
      responsables: ["r-louba", "r-rba"], note: "", echeance: "2027-03-31" },
    { id: "a11", briqueId: "b3", ordre: 3, intitule: "Mettre en place le budget / réalisé mensuel par poste",
      responsables: ["r-louba"], note: "", echeance: "2027-03-31" },
    { id: "a12", briqueId: "b3", ordre: 4, intitule: "Construire un suivi fiable de la masse salariale",
      responsables: ["r-louba"], note: "", echeance: "2027-03-31" },
    { id: "a13", briqueId: "b3", ordre: 5, intitule: "Fiabiliser le calcul du seuil de rentabilité",
      responsables: ["r-louba", "r-rba"], note: "", echeance: "2027-03-31" },
    { id: "a14", briqueId: "b3", ordre: 6, intitule: "Construire une prévision de trésorerie",
      responsables: ["r-louba", "r-rba"], note: "", echeance: "2027-03-31" },

    // Brique 4 — Ritualiser le management
    { id: "a15", briqueId: "b4", ordre: 1, intitule: "Lancer le Top 10 min quotidien (fin de journée : fait, pas fait, ce qui coince, le lendemain)",
      responsables: ["r-louba", "r-stephanie"], note: "", echeance: "2026-12-31" },
    { id: "a16", briqueId: "b4", ordre: 2, intitule: "Lancer le point mensuel du service (1 h : le travail et comment on le vit, + et –, NER)",
      responsables: ["r-louba", "r-stephanie"], note: "", echeance: "2026-12-31" },
    { id: "a17", briqueId: "b4", ordre: 3, intitule: "Lancer le point mensuel management Louba et Matthieu",
      responsables: ["r-louba", "r-matthieu"], note: "", echeance: "2026-12-31" },
    { id: "a18", briqueId: "b4", ordre: 4, intitule: "Planifier le bilan annuel à trois",
      responsables: ["r-matthieu"], note: "", echeance: "2027-10-31" },
  ].map((a) => ({ statut: "a-faire", priorite: "moyenne", commentaire: "", ...a })),

  historique: [],
};
