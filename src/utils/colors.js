// ─── Palette de couleurs ───

export const COLORS = {
  // Thème principal
  primary: '#186b3b',
  primaryLight: '#2a9d5c',
  primaryDark: '#0d4a28',

  // Herbe
  grass1: '#5da844',
  grass2: '#4e9638',
  grass3: '#6ab850',

  // Eau
  water1: '#3b8bbd',
  water2: '#2d7aab',
  waterEdge: '#5aa0cc',

  // Murs
  wallTop: '#8B6914',
  wallFront: '#6B4E0A',
  wallSide: '#5A3E08',
  wallHighlight: '#A07C1A',

  // Cheval
  horse: '#8B4513',
  horseDark: '#654321',
  horseLight: '#A0522D',

  // Cerises
  cherry: '#DC143C',
  cherryDark: '#8B0000',
  cherryStem: '#228B22',

  // Gemmes
  gem: '#FFD700',
  gemHighlight: '#FFF8DC',
  gemDark: '#DAA520',

  // Crânes/Abeilles
  skull: '#FFD700',
  skullDark: '#333333',
  skullStripe: '#222222',

  // Portals (calculé dynamiquement)
  portalHue: (channel) => (channel * 37) % 360,

  // UI
  uiBg: '#186b3b',
  uiText: '#ffffff',
  uiBorder: '#0d4a28',
  uiButton: '#2a9d5c',
  uiButtonHover: '#34b86a',
  modalBg: '#f5f0e1',
  modalBorder: '#186b3b',
  modalText: '#333333',

  // Wheat (blé enclos)
  wheat1: '#DAA520',
  wheat2: '#F0C040',
  wheat3: '#E8B830',

  // Escape path
  escapePath: '#FF4444',
  escapeArrow: '#FF0000',
};

/**
 * Retourne la couleur HSL d'un portail par son canal
 */
export function getPortalColor(channel, saturation = 70, lightness = 50) {
  const hue = COLORS.portalHue(channel);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
