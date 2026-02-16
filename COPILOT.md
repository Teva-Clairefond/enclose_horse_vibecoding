# COPILOT.md — Spécification complète : Enclose Horse Clone

## 1. Description du projet

Reproduction fidèle du jeu **[enclose.horse](https://enclose.horse)** — un puzzle quotidien où le joueur place des murs sur une grille pour enfermer un cheval dans le plus grand enclos possible.

---

## 2. Découpage fonctionnel et technique

### 2.1 Modules principaux

| Module | Responsabilité |
|--------|---------------|
| **GameEngine** | Logique métier : grille, BFS pathfinding, scoring, undo/redo |
| **Renderer** | Rendu canvas pixel art : grille, tuiles, animations wiggly |
| **LevelManager** | Chargement/parsing des niveaux, niveaux hardcodés, éditeur |
| **UIManager** | Layout HTML, modals, boutons canvas, navbar |
| **InputHandler** | Clics souris, hover, raccourcis clavier (C, Ctrl+Z, Ctrl+Y) |
| **AnimationSystem** | Boucle d'animation, jitter wiggly, wheat growth, marching ants |
| **SpriteSheet** | Chargement et découpage du spritesheet pixel art |
| **StorageManager** | localStorage : soumissions, joueur, préférences |

### 2.2 Architecture

```
┌─────────────────────────────────────┐
│              index.html              │
│  ┌────────┐ ┌──────────┐ ┌───────┐  │
│  │ Canvas  │ │ UI HTML  │ │Modals │  │
│  │ (game)  │ │ (stats)  │ │       │  │
│  └────┬────┘ └────┬─────┘ └───┬───┘  │
│       │           │            │      │
│  ┌────▼───────────▼────────────▼──┐   │
│  │         main.js (entry)         │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │      GameEngine          │   │   │
│  │  │  - grid, walls, scoring  │   │   │
│  │  │  - BFS pathfinding       │   │   │
│  │  │  - undo/redo stack       │   │   │
│  │  └──────────────────────────┘   │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │      Renderer            │   │   │
│  │  │  - canvas drawing        │   │   │
│  │  │  - sprite sheet          │   │   │
│  │  │  - wiggly animations     │   │   │
│  │  └──────────────────────────┘   │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │      LevelManager        │   │   │
│  │  │  - parse map strings     │   │   │
│  │  │  - daily levels          │   │   │
│  │  └──────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 3. Stack technique

| Composant | Choix |
|-----------|-------|
| **Langage** | JavaScript ES2022 (modules natifs) |
| **Framework** | Vanilla JS — pas de framework (comme l'original) |
| **Rendu** | HTML5 Canvas 2D |
| **Build** | Vite (dev server + build) |
| **Style** | CSS inline dans HTML + variables CSS |
| **Police** | Google Fonts : Schoolbell (cursive) |
| **Tests** | Vitest (unit) + Playwright (e2e) |
| **Linting** | ESLint + Prettier |
| **Package manager** | npm |
| **Containerisation** | Docker (nginx pour servir le build) |

---

## 4. Règles de fidélité et critères de succès

### 4.1 Fidélité visuelle
- [x] Grille pixel art sur canvas avec tuiles 16×16
- [x] Style "wiggly" tremblotant sur TOUS les éléments (titres, boutons, modals)
- [x] Police Schoolbell cursive
- [x] Fond d'herbe tilé en plein écran (canvas séparé)
- [x] Palette : vert foncé (#186b3b par défaut)
- [x] Boutons dessinés sur canvas avec polygones wiggly
- [x] Modals avec fond canvas et bords organiques
- [x] Animation de blé (wheat) lors de l'enclos réussi (BFS animé)
- [x] Chemin d'échappement en pointillés animés (marching ants)
- [x] Bulle de pensée du cheval avec texte lettre par lettre

### 4.2 Fidélité mécanique
- [x] BFS 4-directions (pas de diagonales)
- [x] Le cheval ne traverse pas l'eau ni les murs
- [x] Téléportation par portails (paires par canal)
- [x] Échappement si le BFS atteint un bord de la grille
- [x] Budget de murs limité par niveau
- [x] Placement/retrait de murs en toggle
- [x] Scoring : surface + cerises×3 + gemmes×10 - crânes×5
- [x] Undo/Redo (Ctrl+Z / Ctrl+Shift+Z ou Ctrl+Y)
- [x] Reset (touche C)
- [x] Messages du cheval contextuels (enclosé vs libre, avec pomme, avec abeilles)
- [x] Une seule soumission possible

### 4.3 Critères de succès minimal
1. La grille se rend correctement avec tous les types de tuiles
2. Le joueur peut placer/retirer des murs
3. Le BFS calcule correctement si le cheval est enclos
4. Le score est calculé correctement
5. L'animation wiggly fonctionne
6. Au moins 5 niveaux jouables

---

## 5. Organisation du projet

```
repo/
├── COPILOT.md              # Ce fichier (spécification)
├── README.md               # Documentation utilisateur
├── SESSION.md              # Résultat /session (fin de session)
├── Dockerfile              # Containerisation
├── docker-compose.yml      # Docker Compose
├── .dockerignore
├── .gitignore
├── .eslintrc.json          # Config ESLint
├── .prettierrc             # Config Prettier
├── package.json
├── vite.config.js
├── index.html              # Point d'entrée HTML
├── public/
│   ├── fonts/
│   │   └── Schoolbell-Regular.woff2
│   └── sprites/
│       └── default.png     # Spritesheet pixel art
├── src/
│   ├── main.js             # Entry point
│   ├── engine/
│   │   ├── GameEngine.js   # Logique de jeu principale
│   │   ├── BFS.js          # Algorithme BFS pathfinding
│   │   ├── Scoring.js      # Calcul des scores
│   │   └── UndoRedo.js     # Pile undo/redo
│   ├── renderer/
│   │   ├── Renderer.js     # Rendu principal canvas
│   │   ├── TileRenderer.js # Rendu des tuiles individuelles
│   │   ├── SpriteSheet.js  # Gestion spritesheet
│   │   ├── Background.js   # Fond d'herbe tilé
│   │   └── Animations.js   # Système d'animations
│   ├── ui/
│   │   ├── UIManager.js    # Gestion UI globale
│   │   ├── WigglyButton.js # Boutons canvas wiggly
│   │   ├── WigglyModal.js  # Modals canvas wiggly
│   │   ├── Navbar.js       # Barre de navigation
│   │   ├── HelpModal.js    # Modal d'aide
│   │   └── ThoughtBubble.js # Bulle de pensée du cheval
│   ├── levels/
│   │   ├── LevelManager.js # Gestion des niveaux
│   │   ├── MapParser.js    # Parsing des maps string
│   │   └── dailyLevels.js  # Niveaux quotidiens hardcodés
│   ├── input/
│   │   └── InputHandler.js # Gestion entrées (souris, clavier)
│   ├── storage/
│   │   └── StorageManager.js # Persistance localStorage
│   ├── utils/
│   │   ├── wiggly.js       # Fonctions wiggly/jitter
│   │   ├── colors.js       # Palette de couleurs
│   │   └── constants.js    # Constantes globales
│   └── styles/
│       └── main.css        # Styles CSS
├── tests/
│   ├── unit/
│   │   ├── BFS.test.js
│   │   ├── Scoring.test.js
│   │   ├── GameEngine.test.js
│   │   ├── MapParser.test.js
│   │   └── UndoRedo.test.js
│   └── e2e/
│       └── game.spec.js
└── playwright.config.js
```

---

## 6. Stratégie de développement (ordre des étapes)

### Phase 1 : Fondations (infrastructure)
1. Initialiser le projet (package.json, Vite, ESLint, Prettier)
2. Créer la structure de fichiers
3. Configurer Docker
4. Configurer Git (.gitignore)

### Phase 2 : Moteur de jeu (logique pure, sans rendu)
5. Implémenter MapParser (parsing des maps string)
6. Implémenter BFS pathfinding
7. Implémenter le scoring
8. Implémenter GameEngine (orchestrateur : grille, murs, état)
9. Implémenter UndoRedo
10. Créer les niveaux hardcodés (dailyLevels.js)

### Phase 3 : Rendu (canvas)
11. Créer le spritesheet pixel art (16×16 tiles)
12. Implémenter SpriteSheet loader
13. Implémenter Background (herbe tilée)
14. Implémenter TileRenderer (rendu individuel de chaque type de tuile)
15. Implémenter Renderer (rendu de la grille complète)

### Phase 4 : UI et interactions
16. Créer le HTML de base (index.html)
17. Implémenter les styles CSS (main.css)
18. Implémenter InputHandler (clics, hover, clavier)
19. Implémenter les fonctions wiggly
20. Implémenter WigglyButton
21. Implémenter UIManager (stats, layout)
22. Implémenter Navbar 

### Phase 5 : Animations et polish
23. Implémenter le système d'animations (boucle, callbacks)
24. Implémenter l'animation wheat growth
25. Implémenter marching ants (chemin d'échappement)
26. Implémenter ThoughtBubble (bulle de pensée du cheval)
27. Implémenter WigglyModal + HelpModal

### Phase 6 : Niveaux et persistance
28. Implémenter LevelManager (navigation entre niveaux)
29. Implémenter StorageManager (localStorage)
30. Intégrer la soumission locale

### Phase 7 : Tests et finalisation
31. Écrire les tests unitaires (BFS, Scoring, MapParser, UndoRedo, GameEngine)
32. Écrire les tests e2e (Playwright)
33. Exécuter tous les tests
34. Vérifier la conformité avec les consignes PDF
35. Commit final et push

### Validation entre chaque phase
- Après Phase 2 : les tests unitaires du moteur doivent passer
- Après Phase 3 : la grille doit se rendre visuellement
- Après Phase 4 : le jeu doit être jouable (placement de murs, scoring)
- Après Phase 5 : les animations doivent être fidèles
- Après Phase 7 : tous les tests passent

---

## 7. Types de tuiles — Référence visuelle

| Tuile | Char | Sprite | Comportement |
|-------|------|--------|-------------|
| Herbe | `.` | Vert clair avec variation | Traversable, mur posable |
| Eau | `~` | Bleu avec bords adaptifs (14 variantes) | Infranchissable |
| Mur | (posé) | Cube 3D en bois | Bloque le cheval |
| Cheval | `H` | Sprite animé (idle, jitter) | Position initiale |
| Cerise | `C` | Petite cerise rouge sur herbe | +3 si enclos |
| Gemme | `G` | Pomme dorée brillante | +10 si enclos |
| Crâne | `S` | Abeille/crâne jaune | -5 si enclos |
| Portail | `0-9,a-z` | Cercle coloré (teinte HSL unique par canal) | Téléportation |

---

## 8. Messages du cheval

### Quand libre (non enclos)
- "Horses should be able to vote."
- "I want nothing more than to escape..."
- "Freedom is just a wall away."

### Quand enclos
- "I find it all rather Kafkaesque."
- "tfw no horse gf"
- "The Demon God of this world saw fit to mock me with this forced smile."
- "This is fine. Everything is fine."

### Contextuels
- Avec gemme : "At least there's a golden apple in here."
- Avec crâne/abeille : "WHY ARE THERE BEES IN HERE WITH ME?"

---

## 9. Constantes clés

```javascript
TILE_SIZE = 16;          // Taille sprite en pixels
SPRITE_STRIDE = 18;      // Stride dans le spritesheet (16 + 2 padding)
WAVE_DELAY = 40;          // ms entre niveaux BFS wheat
GROW_DURATION = 400;      // ms croissance blé
ANIMATION_FRAME_MS = 333; // ~3 FPS pour jitter
MAX_UNDO = 50;            // Taille max pile undo
CHERRY_BONUS = 3;
GEM_BONUS = 10;
SKULL_PENALTY = 5;
```

---

## 10. Raccourcis clavier

| Touche | Action |
|--------|--------|
| `C` | Reset tous les murs |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` ou `Ctrl+Y` | Redo |

---

## 11. Notes d'implémentation

- Le spritesheet sera créé manuellement en pixel art (canvas ou outil)
- Les tiles d'eau utilisent un système de bords adaptatifs basé sur les voisins
- L'effet wiggly utilise un PRNG basé sur sin() : `sin(seed*9999 + frame*7777) * 10000 % 1 - 0.5`
- Les boutons sont des `<canvas>` individuels avec des polygones déformés
- Le fond d'herbe est un canvas séparé en `position: fixed` derrière tout
- Le jeu est responsive (la grille scale en fonction de la fenêtre)
