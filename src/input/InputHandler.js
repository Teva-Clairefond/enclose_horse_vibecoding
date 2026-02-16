// ─── Input Handler ───
// Gestion des entrées souris/clavier

export class InputHandler {
  constructor(canvas, gameEngine, renderer, onUpdate) {
    this.canvas = canvas;
    this.engine = gameEngine;
    this.renderer = renderer;
    this.onUpdate = onUpdate;

    this._setupMouseEvents();
    this._setupKeyboardEvents();
  }

  _setupMouseEvents() {
    this.canvas.addEventListener('click', (e) => {
      if (!this.engine.level) return;

      const idx = this.renderer.pixelToCell(
        e.clientX,
        e.clientY,
        this.engine.level.cols,
        this.engine.level.rows,
      );

      if (idx < 0) return;

      // Si on clique sur le cheval, montrer le chemin d'échappement
      if (idx === this.engine.level.playerIdx) {
        this.engine.showEscapePath = !this.engine.showEscapePath;
        this.renderer.hoveredIsHorse = this.engine.showEscapePath;
        this.onUpdate();
        return;
      }

      if (this.engine.canPlaceWall(idx)) {
        this.engine.toggleWall(idx);
        this.onUpdate();
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.engine.level) return;

      const idx = this.renderer.pixelToCell(
        e.clientX,
        e.clientY,
        this.engine.level.cols,
        this.engine.level.rows,
      );

      if (idx !== this.renderer.hoveredIdx) {
        this.renderer.hoveredIdx = idx;

        // Montrer le chemin d'échappement au hover sur le cheval
        if (idx === this.engine.level.playerIdx) {
          this.renderer.hoveredIsHorse = true;
        } else {
          this.renderer.hoveredIsHorse = false;
        }

        this.onUpdate();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.renderer.hoveredIdx = -1;
      this.renderer.hoveredIsHorse = false;
      this.onUpdate();
    });

    // Curseur : pointer sur les cases cliquables
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.engine.level) return;

      const idx = this.renderer.pixelToCell(
        e.clientX,
        e.clientY,
        this.engine.level.cols,
        this.engine.level.rows,
      );

      if (idx >= 0 && (this.engine.canPlaceWall(idx) || idx === this.engine.level.playerIdx)) {
        this.canvas.style.cursor = 'pointer';
      } else {
        this.canvas.style.cursor = 'default';
      }
    });
  }

  _setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      // C → Reset
      if (e.key === 'c' || e.key === 'C') {
        if (!e.ctrlKey && !e.metaKey) {
          this.engine.reset();
          this.onUpdate();
          return;
        }
      }

      // Ctrl+Z → Undo
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        this.engine.undo();
        this.onUpdate();
        return;
      }

      // Ctrl+Shift+Z ou Ctrl+Y → Redo
      if (
        (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (e.key === 'y' && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        this.engine.redo();
        this.onUpdate();
        return;
      }
    });
  }
}
