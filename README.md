# 🐴 enclose.horse — Clone

Clone fidèle du jeu [enclose.horse](https://enclose.horse) — un puzzle quotidien où vous placez des murs sur une grille pour enfermer un cheval dans le plus grand enclos possible.

## 🎮 Jouer

```bash
npm install
npm run dev
```

Ouvrez http://localhost:3000

## 🏗️ Stack

- **Vanilla JS** (ES2022, modules natifs)
- **HTML5 Canvas** pour le rendu pixel art
- **Vite** pour le build & dev server
- **Vitest** pour les tests unitaires
- **Docker** pour la containerisation

## 📐 Règles du jeu

- Cliquez sur les cases d'herbe pour placer des murs
- Le budget de murs est limité par niveau
- Le cheval ne peut pas se déplacer en diagonale ni traverser l'eau
- Cerises enclosées : **+3 points**
- Pommes dorées enclosées : **+10 points**
- Abeilles enclosées : **-5 points**
- Les portails connectent des cellules distantes — le cheval peut se téléporter !
- Plus l'enclos est grand, plus le score est élevé

## ⌨️ Raccourcis

| Touche | Action |
|--------|--------|
| `C` | Reset tous les murs |
| `Ctrl+Z` | Annuler |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Refaire |

## 🧪 Tests

```bash
npm test        # Tests unitaires (68 tests)
```

## 🐳 Docker

```bash
docker compose up --build
```

Le jeu est accessible sur http://localhost:8080

## 📁 Structure

```
src/
├── engine/       # Moteur de jeu (BFS, scoring, undo/redo)
├── renderer/     # Rendu canvas (sprites, animations, fond)
├── ui/           # Interface (boutons wiggly, modals, navbar)
├── levels/       # Niveaux et parsing de maps
├── input/        # Gestion des entrées (souris, clavier)
├── storage/      # Persistance localStorage
├── utils/        # Utilitaires (wiggly, couleurs, constantes)
└── styles/       # CSS
```

## 📝 Projet MiniVibes — LPTF 2026

Projet réalisé intégralement par vibe coding avec GitHub Copilot (Claude Opus 4.6).
