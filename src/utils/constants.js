// ─── Constantes globales ───

export const TILE_SIZE = 16;
export const SPRITE_STRIDE = 18;
export const SCALE = 3; // Facteur de mise à l'échelle des pixels

export const WAVE_DELAY = 40; // ms entre niveaux BFS wheat
export const GROW_DURATION = 400; // ms croissance blé
export const ANIMATION_FRAME_MS = 333; // ~3 FPS pour jitter

export const MAX_UNDO = 50;

export const CHERRY_BONUS = 3;
export const GEM_BONUS = 10;

// Types de terrain
export const TERRAIN = {
  GRASS: 0,
  WATER: 1,
};

// Directions de déplacement (haut, bas, gauche, droite — PAS de diagonales)
export const DIRECTIONS = [
  [-1, 0], // haut
  [1, 0], // bas
  [0, -1], // gauche
  [0, 1], // droite
];

// Thèmes de couleurs
export const THEMES = {
  default: '#186b3b',
  classic: '#365022',
  girl: '#7c507e',
  hot: '#272727',
};

export const DEFAULT_THEME = 'default';
