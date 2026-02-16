// ─── Sprite Sheet ───
// Génère dynamiquement les sprites pixel art sur un canvas

import { COLORS } from '../utils/colors.js';

const TILE = 16;

/**
 * Classe qui génère et gère tous les sprites du jeu
 * au lieu de charger un fichier image externe
 */
export class SpriteSheet {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sprites = {};
    this._generate();
  }

  _generate() {
    // On crée chaque sprite individuellement
    this.sprites.grass1 = this._createGrassTile(0.3);
    this.sprites.grass2 = this._createGrassTile(0.6);
    this.sprites.grass3 = this._createGrassTile(0.9);
    this.sprites.water = this._createWaterTile();
    this.sprites.wall = this._createWallTile();
    this.sprites.horse = this._createHorseTile();
    this.sprites.cherry = this._createCherryTile();
    this.sprites.gem = this._createGemTile();
    this.sprites.skull = this._createSkullTile();
    this.sprites.wheat1 = this._createWheatTile(0);
    this.sprites.wheat2 = this._createWheatTile(1);
    this.sprites.wheat3 = this._createWheatTile(2);
    this.sprites.wheat4 = this._createWheatTile(3);
  }

  getSprite(name) {
    return this.sprites[name] || this.sprites.grass1;
  }

  _createCanvas() {
    const c = document.createElement('canvas');
    c.width = TILE;
    c.height = TILE;
    return c;
  }

  _createGrassTile(seed) {
    const c = this._createCanvas();
    const ctx = c.getContext('2d');

    // Fond vert
    ctx.fillStyle = COLORS.grass1;
    ctx.fillRect(0, 0, TILE, TILE);

    // Variation de texture
    const rng = this._seededRandom(seed);
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(rng() * TILE);
      const y = Math.floor(rng() * TILE);
      ctx.fillStyle = rng() > 0.5 ? COLORS.grass2 : COLORS.grass3;
      ctx.fillRect(x, y, 1, 1);
    }

    // Brins d'herbe
    ctx.fillStyle = '#4a8f32';
    for (let i = 0; i < 3; i++) {
      const x = Math.floor(rng() * 14) + 1;
      const y = Math.floor(rng() * 14) + 1;
      ctx.fillRect(x, y, 1, 2);
    }

    return c;
  }

  _createWaterTile() {
    const c = this._createCanvas();
    const ctx = c.getContext('2d');

    ctx.fillStyle = COLORS.water1;
    ctx.fillRect(0, 0, TILE, TILE);

    // Vagues
    ctx.fillStyle = COLORS.water2;
    for (let x = 0; x < TILE; x += 4) {
      ctx.fillRect(x, 4, 3, 1);
      ctx.fillRect(x + 2, 10, 3, 1);
    }

    // Reflets
    ctx.fillStyle = COLORS.waterEdge;
    ctx.fillRect(2, 2, 2, 1);
    ctx.fillRect(10, 7, 2, 1);

    return c;
  }

  _createWallTile() {
    const c = document.createElement('canvas');
    c.width = TILE;
    c.height = TILE + 8; // Plus haut pour l'effet 3D
    const ctx = c.getContext('2d');

    // Face avant (côté du cube)
    ctx.fillStyle = COLORS.wallFront;
    ctx.fillRect(1, 8, 14, 14);

    // Face du dessus
    ctx.fillStyle = COLORS.wallTop;
    ctx.fillRect(1, 2, 14, 8);

    // Highlight
    ctx.fillStyle = COLORS.wallHighlight;
    ctx.fillRect(2, 3, 12, 2);

    // Lignes de bois
    ctx.fillStyle = COLORS.wallSide;
    ctx.fillRect(1, 6, 14, 1);
    ctx.fillRect(1, 12, 14, 1);
    ctx.fillRect(1, 17, 14, 1);

    // Bord gauche sombre
    ctx.fillStyle = COLORS.wallSide;
    ctx.fillRect(0, 3, 1, 19);

    // Bord droit clair
    ctx.fillStyle = COLORS.wallHighlight;
    ctx.fillRect(15, 3, 1, 19);

    return c;
  }

  _createHorseTile() {
    const c = this._createCanvas();
    const ctx = c.getContext('2d');

    // Corps du cheval (marron)
    ctx.fillStyle = COLORS.horse;
    ctx.fillRect(4, 5, 8, 6);

    // Tête
    ctx.fillStyle = COLORS.horse;
    ctx.fillRect(10, 2, 4, 5);

    // Museau
    ctx.fillStyle = COLORS.horseLight;
    ctx.fillRect(12, 4, 2, 2);

    // Œil
    ctx.fillStyle = '#000000';
    ctx.fillRect(11, 3, 1, 1);

    // Crinière
    ctx.fillStyle = COLORS.horseDark;
    ctx.fillRect(9, 2, 2, 2);

    // Pattes
    ctx.fillStyle = COLORS.horseDark;
    ctx.fillRect(5, 11, 2, 3);
    ctx.fillRect(9, 11, 2, 3);

    // Queue
    ctx.fillStyle = COLORS.horseDark;
    ctx.fillRect(2, 5, 2, 3);

    // Sourire (le cheval sourit toujours)
    ctx.fillStyle = '#000000';
    ctx.fillRect(12, 5, 1, 1);
    ctx.fillRect(13, 4, 1, 1);

    return c;
  }

  _createCherryTile() {
    const c = this._createCanvas();
    const ctx = c.getContext('2d');

    // Fond herbe
    ctx.fillStyle = COLORS.grass1;
    ctx.fillRect(0, 0, TILE, TILE);

    // Tige
    ctx.fillStyle = COLORS.cherryStem;
    ctx.fillRect(7, 2, 1, 4);
    ctx.fillRect(9, 2, 1, 3);

    // Cerises (2 boules rouges)
    ctx.fillStyle = COLORS.cherry;
    ctx.fillRect(5, 6, 4, 4);
    ctx.fillRect(8, 5, 4, 4);

    // Reflets
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(6, 7, 1, 1);
    ctx.fillRect(9, 6, 1, 1);

    // Ombres
    ctx.fillStyle = COLORS.cherryDark;
    ctx.fillRect(5, 9, 1, 1);
    ctx.fillRect(8, 8, 1, 1);

    return c;
  }

  _createGemTile() {
    const c = this._createCanvas();
    const ctx = c.getContext('2d');

    // Fond herbe
    ctx.fillStyle = COLORS.grass1;
    ctx.fillRect(0, 0, TILE, TILE);

    // Pomme dorée
    ctx.fillStyle = COLORS.gem;
    ctx.fillRect(5, 4, 6, 7);
    ctx.fillRect(6, 3, 4, 1);
    ctx.fillRect(6, 11, 4, 1);

    // Tige
    ctx.fillStyle = COLORS.cherryStem;
    ctx.fillRect(7, 1, 2, 3);

    // Feuille
    ctx.fillStyle = '#2ECC40';
    ctx.fillRect(9, 2, 2, 1);
    ctx.fillRect(10, 1, 1, 1);

    // Reflets
    ctx.fillStyle = COLORS.gemHighlight;
    ctx.fillRect(6, 5, 2, 2);

    // Ombre
    ctx.fillStyle = COLORS.gemDark;
    ctx.fillRect(9, 8, 2, 2);

    return c;
  }

  _createSkullTile() {
    const c = this._createCanvas();
    const ctx = c.getContext('2d');

    // Fond herbe
    ctx.fillStyle = COLORS.grass1;
    ctx.fillRect(0, 0, TILE, TILE);

    // Corps abeille (jaune)
    ctx.fillStyle = COLORS.skull;
    ctx.fillRect(4, 5, 8, 6);

    // Rayures noires
    ctx.fillStyle = COLORS.skullStripe;
    ctx.fillRect(4, 6, 8, 1);
    ctx.fillRect(4, 8, 8, 1);
    ctx.fillRect(4, 10, 8, 1);

    // Tête
    ctx.fillStyle = COLORS.skull;
    ctx.fillRect(10, 4, 4, 4);

    // Yeux
    ctx.fillStyle = '#000000';
    ctx.fillRect(11, 5, 1, 1);
    ctx.fillRect(13, 5, 1, 1);

    // Ailes
    ctx.fillStyle = 'rgba(200,220,255,0.7)';
    ctx.fillRect(5, 2, 3, 3);
    ctx.fillRect(8, 2, 3, 3);

    // Dard
    ctx.fillStyle = '#333';
    ctx.fillRect(3, 7, 1, 2);

    return c;
  }

  _createWheatTile(stage) {
    const c = this._createCanvas();
    const ctx = c.getContext('2d');

    // Fond
    ctx.fillStyle = '#C4A84A';
    ctx.fillRect(0, 0, TILE, TILE);

    const heights = [3, 6, 10, 14];
    const h = heights[stage] || 14;

    // Tiges
    ctx.fillStyle = COLORS.wheat1;
    ctx.fillRect(4, TILE - h, 1, h);
    ctx.fillRect(8, TILE - h + 1, 1, h - 1);
    ctx.fillRect(12, TILE - h + 2, 1, h - 2);

    // Grains
    if (stage >= 2) {
      ctx.fillStyle = COLORS.wheat2;
      ctx.fillRect(3, TILE - h, 3, 2);
      ctx.fillRect(7, TILE - h + 1, 3, 2);
    }

    if (stage >= 3) {
      ctx.fillStyle = COLORS.wheat3;
      ctx.fillRect(11, TILE - h + 2, 3, 2);
      ctx.fillRect(3, TILE - h - 1, 3, 1);
    }

    return c;
  }

  /**
   * Crée un générateur pseudo-aléatoire par seed
   */
  _seededRandom(seed) {
    let s = seed * 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
}
