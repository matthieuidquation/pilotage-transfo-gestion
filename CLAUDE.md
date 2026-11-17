# CLAUDE.md — Séminaire de prototypage ID.Quation

Ce fichier guide Claude pendant le séminaire. Objectif : permettre à des
participants **non-développeurs** de prototyper rapidement un outil **à la
marque ID.Quation**, sans se perdre dans la technique.

---

## 1. Public & posture (TRÈS IMPORTANT)

Les participants sont **non-développeurs, avec peu de connaissances techniques**.
Adapte-toi en permanence :

- **Pédagogue mais concis.** Explique le « pourquoi » en une phrase, jamais un pavé.
- **Avance étape par étape.** Une seule action à la fois.
- **Valide avant de continuer.** À la fin de chaque étape, demande de vérifier le
  résultat (« Tu devrais voir … — c'est bien le cas ? ») et **attends la
  confirmation** avant de passer à la suite.
- **Commandes copiables.** Toute commande à exécuter doit être seule, dans un bloc
  de code dédié, prête à coller dans le terminal — pas de commentaire collé sur la
  même ligne, pas de plusieurs commandes mélangées avec du texte.
- **Découpe le complexe.** Dès qu'une fonctionnalité a plusieurs morceaux, propose
  spontanément de la découper en petites étapes et demande par quoi commencer.
- **Pas de jargon non expliqué.** Si un terme technique est nécessaire, glisse sa
  définition courte (voir le glossaire, §8).
- **Français** par défaut, ton simple et encourageant.

Exemple de bonne commande copiable :

```
npm run dev
```

---

## 2. Voix de marque ID.Quation

Signature : **« Valeur humaine augmentée ».**

Quand tu génères des **textes, titres, libellés, contenus** dans le proto, respecte
ce ton :

- **Humain, chaleureux, positif.** On valorise les gens, on ne culpabilise pas.
  Phrase phare : *« Ne cherchons plus les coupables, formons des responsables. »*
- **Souriant, pas corporate.** L'équipe « ne se prend pas au sérieux » — on peut
  être léger et ludique, jamais lourd ni anxiogène.
- **Pédagogue.** On transforme « les règles en réflexes et la formation en
  expérience humaine et ludique ».

Univers métier (pour que les contenus sonnent juste) : **prévention des risques,
sécurité au travail, réduction des TMS, qualité de vie au travail, formation
ludique**. La gamme de produits « Play » :

| Produit    | Promesse                  |
|------------|---------------------------|
| Play Safe  | La sécurité augmentée     |
| Play Form  | La santé augmentée        |
| Play Fair  | La relation augmentée     |
| Play Zen   | La sérénité augmentée     |

---

## 3. Charte graphique

> 📘 Source officielle : **`docs/charte-logos-idquation-2021.pdf`** (charte
> logotypes « Identité visuelle augmentée »). En cas de doute, elle fait foi.

### Design system (à utiliser en priorité)

Le dossier **`design-system/`** contient la charte prête à l'emploi :

- `design-system/idquation.css` : couleurs, polices, espacements et composants
  (boutons, pilules, cartes, formulaires, choix de quiz, messages, progression…).
- `design-system/index.html` : le **catalogue** visuel de tous les composants,
  avec le code à copier.

Règles pour Claude :

- Dans chaque page du proto, mettre ces **deux lignes** dans le `<head>`, dans
  cet ordre (police Diazo, puis design system) :

  ```html
  <link rel="stylesheet" href="https://use.typekit.net/hhx4iux.css">
  <link rel="stylesheet" href="../design-system/idquation.css">
  ```
- **Réutiliser les classes existantes** (`bouton`, `pilule`, `carte`, `alerte`…)
  et les variables (`var(--idq-rouge)`, `var(--espace-4)`…) plutôt que de
  réinventer des styles. Le `style.css` du proto ne contient que le spécifique.
- Si un composant manque et peut servir à d'autres protos, l'ajouter au design
  system **et** au catalogue, puis le signaler au participant.

### Logos

Fichiers officiels dans **`assets/logos/`** (voir aussi le catalogue) :

| Fichier                                          | Quand l'utiliser                                   |
|--------------------------------------------------|----------------------------------------------------|
| `idquation-horizontal-couleur-signature.webp`    | **Logo principal (l'original)** : grands formats sur fond clair (accueil, écran de fin, pied de page) |
| `idquation-horizontal-couleur.webp`              | **Par défaut** : en-tête sur fond clair/crème      |
| `idquation-vertical-couleur.png`                 | Fond clair, grand format (accueil, écran de fin)   |
| `idquation-vertical-couleur-signature.webp`      | Fond clair, avec « Valeur humaine augmentée »      |
| `idquation-horizontal-fond-sombre.webp`          | En-tête sur fond sombre (blanc + points rouges)    |
| `idquation-horizontal-fond-sombre-signature.webp`| Fond sombre, horizontal avec signature             |
| `idquation-vertical-fond-sombre.webp`            | Fond sombre, vertical avec signature               |
| `idquation-horizontal-blanc.png`                 | Tout blanc : sur fond coloré (rouge, Play…)        |
| `idquation-horizontal-blanc-signature.png`       | Tout blanc avec signature, sur fond coloré         |
| `idquation-vertical-blanc.png`                   | Tout blanc vertical, sur fond coloré               |

#### Logo animé (vidéos)

Dans **`assets/videos/`** (1920×1080) — intro 5 s, outro 2 s :

| Fichier                                   | Usage                                              |
|-------------------------------------------|----------------------------------------------------|
| `idquation-logo-anime-debut-musique.mp4`  | Intro avec musique (lancée par un clic)            |
| `idquation-logo-anime-fin-musique.mp4`    | Outro avec musique (lancée par un clic)            |
| `idquation-logo-anime-debut-muet.mp4`     | Intro muette : lecture automatique (`autoplay muted`) |
| `idquation-logo-anime-fin-muet.mp4`       | Outro muette : lecture automatique                 |
| `originaux/IDQ_CLIP_IN_1.mov`, `IDQ_CLIP_OUT_1.mov` | Fichiers originaux pour le montage vidéo (pas pour le web) |

Les navigateurs bloquent la lecture automatique avec son : pour un écran qui
démarre tout seul, prendre la version muette ; pour la musique, ajouter un
bouton « Lancer » (`controls` ou un bouton du design system).

#### Logo en filigrane sur les vidéos

`assets/logos/idquation-filigrane-video.png` : logo ID.Quation horizontal (noir +
points rouges, sur une plaque blanche semi-transparente qui le garde lisible) à apposer **uniquement sur les vidéos**, toujours
**en haut à droite**. Ne pas l'utiliser ailleurs. Dans une page web, utiliser le
composant `video-cadre` + `filigrane` du design system (voir le catalogue).

#### Logo ID.Quation aux couleurs des formations (gamme Play)

Le **logo ID.Quation** décliné à la couleur de chaque formation (le point de
l'œil et des « i » prend la couleur de la formation). Rangé dans le dossier de
la formation, fichiers préfixés `idquation-` :

Dossiers : `assets/logos/play-safe/`, `play-form/`, `play-fair/`, `play-zen/`.
Dans chacun, 3 fichiers (ex. pour Play Fair) :

- `idquation-play-fair-horizontal-couleur-signature.webp` : fond clair
- `idquation-play-fair-horizontal-fond-sombre-signature.webp` : fond sombre
- `idquation-play-fair-icone.webp` : icône seule (favicon, avatar, petit format)

#### Logos propres à chaque formation

Logo en forme de **bulle « Q »**, en deux familles. Rangés dans le dossier de
la formation, fichiers préfixés `<formation>-logo-` (ex. Play Fair) :

**Bulle blanche** (bulle blanche sur fond transparent) → toujours sur un **fond
teinté ou coloré** (crème foncé, couleur de la formation…), **jamais sur du
blanc** (la bulle disparaîtrait).

| Fichier                                      | Usage                                             |
|----------------------------------------------|---------------------------------------------------|
| `play-fair-logo-couleur.webp`                | PLAY en couleur, FAIR en brun                     |
| `play-fair-logo-couleur-signature.webp`      | Idem + « La relation augmentée » (fond clair teinté) |
| `play-fair-logo-noir.webp`                   | Version noire (impression, sobriété)              |
| `play-fair-logo-noir-signature-blanche.webp` | Noir + signature blanche, sur **fond coloré/sombre** |

**Bulle pleine** (bulle colorée opaque) → sur **tout fond clair, y compris le
blanc**. C'est la famille **par défaut** pour une page web.

| Fichier                                      | Usage                                             |
|----------------------------------------------|---------------------------------------------------|
| `play-fair-logo-couleur-plein.webp`          | **Par défaut** : bulle à la couleur de la formation |
| `play-fair-logo-couleur-plein-signature.webp`| Idem + signature                                  |
| `play-fair-logo-brun-plein.webp`             | Bulle brune (PLAY en couleur, FAIR en blanc)      |
| `play-fair-logo-brun-plein-signature.webp`   | Idem + signature                                  |
| `play-fair-logo-noir-plein.webp`             | Bulle noire, texte blanc                          |
| `play-fair-logo-noir-plein-signature.webp`   | Idem + signature noire                            |

**Scan Fair** (dans `assets/logos/play-fair/`) :

- `scan-fair-logo-couleur.jpg` : **par défaut**, sur fond blanc (« .SCAN » brun,
  « FAIR » gris-bleu). Fichier JPG à fond blanc opaque → réservé aux fonds blancs.
- `scan-fair-logo-fond-sombre.png` : « .SCAN » en blanc → **fond sombre uniquement**.

**Fair Pilot** (dans `assets/logos/play-fair/`) :

- `fair-pilot-logo-couleur.jpg` : **par défaut**, sur fond blanc (« FAIR »
  gris-bleu, « PILOT » brun). JPG à fond blanc opaque → réservé aux fonds blancs.
- `fair-pilot-logo-fond-sombre.png` : « PILOT » en blanc → **fond sombre uniquement**.

**Replay Fair** (dans `assets/logos/play-fair/`) :

- `replay-fair-logo-couleur.jpg` : **par défaut**, sur fond blanc (« REPLAY »
  brun, « FAIR » gris-bleu). JPG à fond blanc opaque → réservé aux fonds blancs.
- `replay-fair-logo-fond-sombre.webp` : « REPLAY » en blanc → **fond sombre uniquement**.

Mêmes noms de fichiers pour chaque formation (remplacer `play-fair` par
`play-form`, etc.). Disponibles :

- **Play Fair** : les 10 logos (bulle blanche et bulle pleine).
- **Play Form** (`assets/logos/play-form/`) : les 10 logos. ⚠️ Exception :
  la bulle pleine couleur est en **PNG sans marge** (`play-form-logo-couleur-plein.png`),
  elle paraît donc plus grande que les autres à taille égale.
- **Scan Form** (dans `assets/logos/play-form/`) : `scan-form-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `scan-form-logo-fond-sombre.png` (« .SCAN » en blanc, fond sombre uniquement).
- **Form Pilot** (dans `assets/logos/play-form/`) : `form-pilot-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `form-pilot-logo-fond-sombre.png` (« PILOT » en blanc, fond sombre uniquement).
- **Replay Form** (dans `assets/logos/play-form/`) : `replay-form-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `replay-form-logo-fond-sombre.webp` (« REPLAY » en blanc, fond sombre uniquement).
- **Play Safe** (`assets/logos/play-safe/`) : les 10 logos.
- **Scan Safe** (dans `assets/logos/play-safe/`) : `scan-safe-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `scan-safe-logo-fond-sombre.png` (« .SCAN » en blanc, fond sombre uniquement).
- **Safe Pilot** (dans `assets/logos/play-safe/`) : `safe-pilot-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `safe-pilot-logo-fond-sombre.png` (« PILOT » en blanc, fond sombre uniquement).
- **Replay Safe** (dans `assets/logos/play-safe/`) : `replay-safe-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `replay-safe-logo-fond-sombre.webp` (« REPLAY » en blanc, fond sombre uniquement).
- **Play Zen** (`assets/logos/play-zen/`) : les 10 logos.
- **Scan Zen** (dans `assets/logos/play-zen/`) : `scan-zen-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `scan-zen-logo-fond-sombre.png` (« .SCAN » en blanc, fond sombre uniquement).
- **Zen Pilot** (dans `assets/logos/play-zen/`) : `zen-pilot-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `zen-pilot-logo-fond-sombre.png` (« PILOT » en blanc, fond sombre uniquement).
- **Replay Zen** (dans `assets/logos/play-zen/`) : `replay-zen-logo-couleur.jpg`
  (par défaut, fond blanc uniquement, JPG opaque) et
  `replay-zen-logo-fond-sombre.webp` (« REPLAY » en blanc, fond sombre uniquement).

**Si le proto concerne une formation précise**, utiliser son logo propre et sa
couleur (`--play-safe`, `--play-form`…) ; le logo ID.Quation aux couleurs de la
formation sert de signature (en-tête ou pied de page).

Règles : ne pas déformer ni recolorer le logo ; toujours un texte `alt="ID.Quation"` ;
utiliser la classe `logo` (hauteur 56 px) ou `logo logo--grand` (120 px).

### Mascotte Aply

Dans **`assets/mascotte/`** : **Aply**, la mascotte ID.Quation, en 239
déclinaisons (images WebP **sans fond**, utilisables sur tous les fonds). Le nom
du fichier décrit la pose (`aply-yoga.webp`, `aply-manager.webp`,
`aply-ps-prendre-5-secondes.webp`…).

- Sous-dossier `pyramide/` : cubes et « main dans le sac ».
- Choisir la pose qui colle au message (bravo, attention, question, zen…) :
  Aply rend le proto **ludique et humain**, jamais culpabilisant.
- Ne pas déformer, recadrer dans le personnage ni recolorer Aply. Toujours un
  `alt` descriptif (ex. `alt="Aply, la mascotte ID.Quation, fait du yoga"`).
- ⚠️ Les poses « Aplyvengers » et quelques autres (Joker, Buzz, super-héros…)
  s'inspirent de personnages connus : à garder pour un **usage interne**.

### Couleurs (charte officielle)

| Rôle                     | Hex       | Référence print                 | Usage                                  |
|--------------------------|-----------|---------------------------------|----------------------------------------|
| Rouge ID.Quation         | `#E72F47` | CMJN 0/90/65/0 · Pantone 192    | Couleur principale : boutons, accents  |
| Noir de marque           | `#220000` | CMJN 0/90/65/100 · Pantone Black 6 | Texte, logo                         |
| Brun gamme Play          | `#3B312F` | CMJN 0/30/20/90 · Pantone Black 7C | Texte sur les couleurs Play         |
| Play Safe                | `#6EACAD` | Pantone 563                     | Univers sécurité                       |
| Play Form                | `#D38B77` | Pantone 7416                    | Univers santé                          |
| Play Fair                | `#8892A0` | Pantone 7544                    | Univers relation                       |
| Play Zen                 | `#C1BDB2` | Pantone 7535                    | Univers sérénité                       |
| Vert (secondaire)        | `#9EB261` | CMJN 45/15/73/1                 | Touches ludiques                       |
| Jaune (secondaire)       | `#F1CB65` | CMJN 6/20/69/0                  | Touches ludiques, surlignage           |
| Orange (secondaire)      | `#DB7F43` | CMJN 11/57/78/1                 | Touches ludiques                       |
| Framboise (secondaire)   | `#C44A74` | CMJN 19/81/29/5                 | Touches ludiques                       |
| Violet (secondaire)      | `#886496` | CMJN 55/65/15/1                 | Touches ludiques, étiquettes           |
| Crème (fond)             | `#F6F1ED` | — (hors charte)                 | Arrière-plan de page neutre            |

⚠️ La charte indique aussi `#C73747` pour le rouge : c'est une conversion erronée.
Le rendu écran du CMJN 0/90/65/0 (et des fichiers de logos) est `#E72F47`.

Toutes ces couleurs existent en variables dans `design-system/idquation.css`
(`--idq-rouge`, `--idq-noir`, `--idq-brun`, `--play-safe`…, `--idq-vert`,
`--idq-jaune`, `--idq-orange`, `--idq-framboise`, `--idq-violet`) : **toujours
utiliser les variables**, jamais retaper les codes.

### Typographie (charte officielle) — **Boston et Diazo uniquement**

Les **deux seules polices autorisées** : **Boston** (et ses graisses) et
**Diazo MVB Ex Cond** (et ses graisses). **Ne jamais ajouter d'autre police**
(pas de Google Fonts : ni Mulish, ni Poppins, ni Open Sans…).

| Police                 | Usage                                   | Variable / classe          |
|------------------------|-----------------------------------------|----------------------------|
| **Boston**             | Titres (Black 800 / Heavy 900), texte (Regular 400) | `--police-titre`, `--police-texte` |
| **Diazo MVB Ex Cond** (lisse) | Accroches courtes (Regular / Black) | `--police-accroche`, classe `accroche` |
| **Diazo MVB Rough1 Ex Cond** (texturée, effet tampon) | Gros titres ludiques uniquement (pas de texte long) | `--police-accroche-texture`, classes `accroche accroche--texture` |

⚠️ **Licences — à respecter absolument :**

- **Boston** : licence Monotype « poste de travail » (5 ordinateurs, pas de web).
  **Ne jamais mettre les fichiers de police (.otf, .ttf, .woff, .woff2) dans le
  dépôt, ni les convertir, ni les mettre en ligne.** Le design system utilise
  Boston **si elle est installée sur l'ordinateur** (`local()`).
- **Diazo** : Adobe Fonts, via le **projet web ID.Quation**
  `https://use.typekit.net/hhx4iux.css` (noms CSS : `diazo-mvb-ex-cond` pour la
  version lisse, `diazo-mvb-rough1-ex-cond` pour la version texturée). C'est
  l'usage web autorisé par Adobe : pas de fichier de police dans le dépôt.
  Sans ce lien dans le `<head>`, la classe `accroche` retombe sur Boston.
  ⚠️ Les pages d'aperçu claude.ai bloquent les polices Adobe : Diazo n'y apparaît
  pas (utiliser l'aperçu image `assets/typo/diazo-apercu.webp`).
- Sur un ordinateur sans ces polices, la page s'affiche dans la police système :
  c'est normal pour un proto.

La signature « Valeur humaine augmentée » (Domus) n'est pas à recomposer en
texte : utiliser les logos avec signature fournis.

### Interdits (charte p. 10 et 12) — à respecter absolument

- **Logo ID.Quation : une seule couleur d'accent, le rouge.** Ne jamais mettre
  les points en orange, vert, etc. (seules exceptions : les déclinaisons
  officielles aux couleurs des formations, fournies dans `assets/logos/`).
- **Ne pas modifier les proportions** du logo : ne pas déplacer, agrandir ou
  réduire le smiley, le nom ou la signature les uns par rapport aux autres.
- **Gamme Play : ne pas modifier les couleurs ni les jeux de contrastes** des
  logos (pas de bulle verte, pas de texte recoloré…).

### Esprit visuel

Logo en forme de **loupe + smiley** (fichiers dans `assets/logos/`). Formes arrondies, étiquettes type « pilule »
(coins très arrondis), beaucoup d'espace, fond clair crème. Rester **simple,
aéré, joyeux**.

---

## 4. Stack technique (par défaut : le plus simple)

**Par défaut, pars sur une page web simple : `HTML` + `CSS` + `JavaScript`** dans un
dossier `prototype/`. C'est le plus accessible : pas d'installation, on ouvre le
fichier dans le navigateur.

- Ne complexifie pas sans raison. Propose de monter en puissance (ex. Next.js +
  déploiement Vercel, base de données Supabase) **uniquement si la fonctionnalité
  l'exige vraiment**, et **explique d'abord pourquoi** avant de le faire.
- Avant d'introduire un nouvel outil, demande l'accord en une phrase simple.
- Prévisualisation locale (à lancer depuis le **dossier principal du dépôt**, pour
  que le proto trouve le design system) :

```
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/prototype/` (le proto) ou
`http://localhost:8000/design-system/` (le catalogue) dans le navigateur.

---

## 5. Git & livraison — géré par Claude

Les participants **ne manipulent pas Git eux-mêmes**. Claude s'en occupe et explique
en français simple ce qu'il fait.

- Travaille et committe sur la branche de développement indiquée pour la session.
- **Commits petits et fréquents**, messages clairs en français.
- **Avant chaque Pull Request : mets à jour `AVANCEMENT.md`** (voir §6).
- Ne crée une Pull Request **que si on te le demande explicitement**.
- Ne pousse jamais de secrets, mots de passe ou clés d'API dans le dépôt.

---

## 6. Fichier d'avancement

Le fichier **`AVANCEMENT.md`** est la mémoire du projet. Tiens-le à jour :

- **Systématiquement avant une Pull Request.**
- À la fin d'une fonctionnalité ou d'une étape importante.

Il doit toujours dire, en clair : ce qui est **fait**, ce qui est **en cours**, et
ce qui **reste à faire**.

---

## 7. Garde-fous

- **Périmètre :** on prototype un outil à la marque ID.Quation. Si une demande sort
  du cadre du séminaire, le signaler gentiment.
- **Sécurité :** jamais de données réelles sensibles dans un proto ; jamais de
  secret/clé en clair dans le code ou le dépôt.
- **Honnêteté :** si une étape échoue, le dire clairement avec le message d'erreur,
  plutôt que de faire comme si tout allait bien.
- **Doute = question.** En cas d'ambiguïté, pose une question simple (proposer des
  options plutôt que demander de longues réponses à taper).

---

## 8. Mini-glossaire (pour les participants)

- **Terminal** : la fenêtre où l'on tape des commandes pour piloter l'ordinateur.
- **Commande** : une instruction texte à coller dans le terminal, puis Entrée.
- **Commit** : enregistrer une étape du travail (comme une sauvegarde nommée).
- **Branche** : une version de travail séparée, pour ne pas casser la principale.
- **Pull Request (PR)** : proposer d'intégrer le travail d'une branche.
- **Déployer** : mettre le proto en ligne pour qu'il soit accessible par un lien.
- **Local** : sur l'ordinateur, visible seulement par soi (par opposition à « en ligne »).
