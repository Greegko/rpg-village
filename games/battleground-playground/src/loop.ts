import { Battlefield, BattlefieldConfig } from "@battleground/core";
import { Mod } from "@battleground/mods";
import {
  AssetManager,
  BattlefieldRenderer,
  BattlefieldRendererConfig,
  Pixi2DRenderer,
  SpellSelection,
} from "@battleground/renderer";

export class Loop {
  constructor(private config: BattlefieldConfig & BattlefieldRendererConfig, private mod: Mod) {
    this.renderer = new Pixi2DRenderer();
    this.battleField = new Battlefield(config, mod.resourceManager);
    this.spellSelection = new SpellSelection(this.renderer, this.battleField);
  }

  readonly spellSelection: SpellSelection;

  battleField: Battlefield;

  private renderer: BattlefieldRenderer;

  private isRunning: boolean = false;

  get assetManager(): AssetManager {
    return this.mod.assetManager;
  }

  async init() {
    await this.renderer.init(this.config, this.mod.assetManager);
    this.battleField.init(this.mod.battlefieldInit(this.config));
    this.spellSelection.init();
  }

  jumpToTick(tick: number) {
    for (let i = 0; i < tick; i++) {
      this.battleField.tick();
    }
  }

  stop() {
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.loop();
  }

  tick() {
    this.battleField.tick();

    const battleFieldState = this.battleField.getState();

    this.renderer.renderScene(battleFieldState);

    if (this.battleField.isFinished) {
      this.isRunning = false;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    this.tick();
    if (this.config.speed === "requestFrame") {
      requestAnimationFrame(this.loop);
    } else {
      setTimeout(this.loop, 1000 / this.config.speed);
    }
  };
}
