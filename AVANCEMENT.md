# Avancement du projet

> Mémoire du projet, tenue à jour par Claude — avant chaque Pull Request et à la
> fin de chaque étape importante.

**Nom :** Pilotage de la feuille de route du service gestion
**Objectif en une phrase :** faire vivre la feuille de route de transformation du
service gestion (briques, actions, priorités, frise) pour la mise à jour
hebdomadaire de Louba et le point mensuel Louba / Matthieu.

## Architecture validée

- **Interface** : page web simple (HTML + CSS + JavaScript) dans `prototype/`,
  avec le design system ID.Quation.
- **Hébergement** : serveur PHP d'ID.Quation (géré par Matthieu).
- **Données** (étape 2) : base MySQL + petite API PHP ; connexion par e-mail et
  mot de passe (sessions PHP). Matthieu et Louba en modification ; Stéphanie
  pourra être ajoutée en lecture.
- **Objectif du service** : modifiable par Matthieu et Louba.
- **Responsables** : liste modifiable depuis l'outil (ajout, renommage, retrait).

## ✅ Fait

### Étape 1 — Interface complète en mode démo
- Les données sont enregistrées dans le navigateur (localStorage). Un menu
  « Je suis » simule l'utilisateur connecté, et un bouton « Réinitialiser la
  démo » recharge les données de départ.
- **Feuille de route** : bandeau « Notre cap » (ambition + objectif, modifiable),
  briques ouvertes, chantiers à venir, briques terminées. On change l'ordre par
  glisser-déposer (ou au clavier avec les flèches ↑ ↓ sur la poignée ⠿).
- **Fiche brique** : infos, avancement, boutons Ouvrir / Clôturer / Rouvrir /
  Supprimer. La liste des actions permet de changer le statut et la priorité en
  un clic, de changer l'ordre par glisser-déposer et de trier par priorité puis
  échéance. Une action en retard est signalée en rouge. Commentaire libre.
- **Historique** par brique : changements de statut, de dates et de priorité,
  créations et suppressions, datés et attribués.
- **Synthèse** : filtre par responsable, frise (Gantt) avec le trait
  « Aujourd'hui » et la part des actions faites, avancement des briques
  ouvertes, actions en retard ou bloquées, échéances des 30 prochains jours,
  impression / PDF.
- **Responsables** : ajouter, renommer, retirer de la liste ou y remettre.
- Données de départ chargées : 4 briques ouvertes, 3 à ouvrir, 18 actions
  (statut « À faire », priorité « Moyenne » par défaut).

### Fichiers
- `prototype/index.html` : structure et fenêtres de saisie.
- `prototype/app.js` : écrans et interactions.
- `prototype/donnees.js` : couche de données (démo). **Seul fichier à remplacer
  pour passer au serveur PHP.**
- `prototype/donnees-depart.js` : données de départ.
- `prototype/style.css` : styles propres à l'outil.

## 🔄 En cours

- Test de la démo par Matthieu et Louba.

## 📋 Reste à faire

1. **Étape 2 — Serveur PHP + MySQL** : script de création des tables et des
   données de départ, API PHP (lecture, création, modification, ordre),
   historique enregistré côté serveur, connexion par mot de passe, rôles
   éditeur / lecteur. Infos à récupérer : version de PHP, accès à une base
   MySQL (ou MariaDB), dossier de dépôt sur le serveur.
2. **Étape 3 — Mise en ligne** sur le serveur PHP et test avec Louba.
3. Plus tard : compte en lecture pour Stéphanie.

Hors périmètre de la V1 : indicateurs chiffrés, notifications, pièces jointes,
application mobile.

---

## Socle STARTER ID.Quation (déjà en place)

Design system (`design-system/`), charte officielle (`docs/`), logos, vidéos et
mascotte Aply (`assets/`), règles de marque dans `CLAUDE.md`.
