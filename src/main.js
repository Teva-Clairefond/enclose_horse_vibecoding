// ─── Main Entry Point ───
// Assemblage de tous les modules du jeu

import './styles/main.css';
import { GameEngine } from './engine/GameEngine.js';
import { Renderer } from './renderer/Renderer.js';
import { Background } from './renderer/Background.js';
import { LevelManager } from './levels/LevelManager.js';
import { InputHandler } from './input/InputHandler.js';
import { UIManager } from './ui/UIManager.js';
import { StorageManager } from './storage/StorageManager.js';
import { TILE_SIZE, SCALE } from './utils/constants.js';

// ─── Initialisation ───

const gameCanvas = document.getElementById('game');
const engine = new GameEngine();
const renderer = new Renderer(gameCanvas);
const background = new Background();
const levelManager = new LevelManager();
const storage = new StorageManager();

// Callback de mise à jour global
function onUpdate() {
  renderer.render(engine.getState());
  ui.updateStats();
}

// UI Manager
const ui = new UIManager(engine, renderer, levelManager, storage, onUpdate);

// Input Handler
const input = new InputHandler(gameCanvas, engine, renderer, onUpdate);

// Gestion du hover sur le cheval
gameCanvas.addEventListener('mousemove', (e) => {
  if (!engine.level) return;
  const idx = renderer.pixelToCell(e.clientX, e.clientY, engine.level.cols, engine.level.rows);

  if (idx === engine.level.playerIdx) {
    const rect = gameCanvas.getBoundingClientRect();
    const col = engine.level.playerIdx % engine.level.cols;
    const row = Math.floor(engine.level.playerIdx / engine.level.cols);
    const x = rect.left + col * TILE_SIZE * SCALE + (TILE_SIZE * SCALE) / 2;
    const y = rect.top + row * TILE_SIZE * SCALE;
    ui.handleHorseInteraction(x - rect.left, y - rect.top);
  } else {
    ui.hideThoughtBubble();
  }
});

// ─── Boucle d'animation principale ───

function gameLoop(now) {
  // Rendu du jeu
  renderer.render(engine.getState());

  // Rendu des éléments UI animés
  ui.renderFrame(now);

  requestAnimationFrame(gameLoop);
}

// ─── Démarrage ───

ui.init();
renderer.animations.register(() => {}); // Active la boucle d'animation
requestAnimationFrame(gameLoop);

console.log('🐴 e n c l o s e . h o r s e — clone loaded!');
