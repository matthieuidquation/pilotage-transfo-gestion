# Avancement du modèle

> Mémoire du projet, tenue à jour par Claude — avant chaque Pull Request et à la
> fin de chaque étape importante.

**Nom :** STARTER ID.Quation — modèle de prototype avec design system intégré
**Objectif en une phrase :** chaque nouveau projet créé avec « Use this template »
reçoit automatiquement la charte, les logos, les polices et les règles de marque
ID.Quation.

**Aperçu du catalogue (lien privé) :** https://claude.ai/artifact/KWLVjB8ycZwZgprVtgjWJb

## ✅ Fait

### Design system (`design-system/`)
- Feuille de style unique `idquation.css` : couleurs, polices, espacements et
  composants (boutons, pilules, cartes, formulaires, choix de quiz, messages,
  progression, score, avatar, vidéo avec filigrane, accroches).
- Catalogue visuel `index.html` avec le code à copier pour chaque composant.
- Le prototype de départ (`prototype/`) utilise déjà le design system.

### Charte officielle (`docs/charte-logos-idquation-2021.pdf`)
- Couleurs officielles appliquées : rouge `#E72F47`, noir `#220000`, brun Play
  `#3B312F`, gamme Play (Safe, Form, Fair, Zen) et 5 couleurs secondaires.
- Interdits de la charte inscrits dans `CLAUDE.md` (une seule couleur d'accent
  pour le logo, proportions intouchables, couleurs Play intouchables).

### Polices (Boston et Diazo uniquement)
- **Boston** : utilisée si elle est installée sur l'ordinateur (licence Monotype
  poste de travail — aucun fichier de police dans le dépôt, bloqué par `.gitignore`).
- **Diazo** : branchée via le projet web Adobe Fonts ID.Quation
  (`use.typekit.net/hhx4iux.css`) — version lisse (`diazo-mvb-ex-cond`) et
  version texturée (`diazo-mvb-rough1-ex-cond`).
- Aperçu image de Diazo dans le catalogue (les pages claude.ai bloquent Adobe Fonts).

### Logos (`assets/logos/`)
- ID.Quation : 10 versions (dont le logo principal original), fond clair, fond
  sombre, tout blanc, avec ou sans signature.
- Logo en filigrane pour les vidéos (en haut à droite).
- Pour chacune des 4 formations (Play Safe, Play Form, Play Fair, Play Zen) :
  10 logos en bulle (blanche et pleine), outils Scan / Pilot / Replay
  (fond blanc et fond sombre), logo ID.Quation à la couleur de la formation.

### Vidéos (`assets/videos/`)
- Logo animé intro (5 s) et outro (2 s) : avec musique, muet, et originaux .mov.

### Mascotte Aply (`assets/mascotte/`)
- 239 poses d'Aply (WebP sans fond), dont le sous-dossier `pyramide/`.
- Règles d'usage ajoutées dans `CLAUDE.md` (choix de la pose, `alt`, poses à usage interne).

## 🔄 En cours

- _rien pour l'instant_

## 📝 Reste à faire

- Vérifier si Diazo **Rough1** ou **Rough2** correspond le mieux à la charte.
- Alléger le projet web Adobe Fonts (garder seulement les 2 familles « Ex Cond » utilisées).
- Recevoir le GIF animé du logo (à envoyer comme fichier).
- Boston sur le web : acheter une licence webfont, ou garder l'affichage local.
- Option : replier les blocs de code du catalogue derrière « Voir le code ».
- Faire la Pull Request pour intégrer ce travail au modèle principal.
