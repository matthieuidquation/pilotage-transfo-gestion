# STARTER — modèle de prototype ID.Quation

> *Valeur humaine augmentée.*

Ce dépôt est le **point de départ commun** de tous les prototypes ID.Quation.
Il contient déjà la charte graphique, le ton de la marque et les règles qui
guident Claude pendant le séminaire de prototypage.

## Démarrer un nouveau prototype

1. Sur GitHub, cliquer sur le bouton vert **« Use this template »** puis
   **« Create a new repository »**.
2. Donner un nom au nouveau dépôt (ex. `proto-play-safe-quiz`), choisir
   l'organisation **ID-QUATION**, puis valider.
3. Ouvrir ce nouveau dépôt avec Claude Code et décrire l'outil à prototyper.
   Claude s'occupe du reste, étape par étape.

## Ce que contient le modèle

| Élément            | À quoi ça sert                                                  |
|--------------------|-----------------------------------------------------------------|
| `CLAUDE.md`        | Les consignes pour Claude : public, ton, charte, stack, Git.    |
| `AVANCEMENT.md`    | La mémoire du projet : fait / en cours / reste à faire.         |
| `design-system/`   | La charte en briques prêtes à l'emploi + un catalogue visuel.   |
| `prototype/`       | Une page web prête à l'emploi, déjà aux couleurs ID.Quation.    |
| `docs/`            | La charte graphique officielle (PDF).                           |
| `assets/logos/`    | Les logos officiels ID.Quation (fond clair et fond sombre).     |
| `assets/videos/`   | Le logo animé intro / outro (avec musique ou muet).             |
| `assets/mascotte/` | Aply, la mascotte ID.Quation : 239 poses sans fond.           |
| `assets/fonts/`    | Vide volontairement : les polices Boston et Diazo sont sous licence et ne vont pas dans le dépôt. |

## Voir le prototype sur son ordinateur

Depuis le dossier principal du dépôt, lancer :

```
python3 -m http.server 8000
```

Puis ouvrir dans le navigateur :

- `http://localhost:8000/prototype/` pour voir le prototype ;
- `http://localhost:8000/design-system/` pour voir le catalogue du design system.

## Le design system

Le dossier `design-system/` rassemble tout ce qu'il faut pour rester à la marque :
couleurs, polices, boutons, cartes, pilules, formulaires, quiz, messages,
barres de progression… Ouvrir `design-system/index.html` pour voir chaque
composant et le code à copier. Claude l'utilise automatiquement.
