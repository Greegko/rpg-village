import { Graphics } from "pixi.js";

import { SpellID, Unit, Battlefield } from "../../battlefield";
import { Vector } from "../../utils";
import { BattlefieldRenderer } from "../battlefield-renderer";

export class SpellSelection {
  constructor(private renderer: BattlefieldRenderer, private battlefield: Battlefield) {}

  private circleGraphics = new Graphics();
  private spellId: SpellID | null = null;
  private position: Vector | null = null;

  init() {
    this.renderer.addChild(this.circleGraphics);
  }

  startSpellSelection(spellId: SpellID, position: Vector) {
    this.spellId = spellId;
    this.position = position;

    this.highlightUnitSelection();
    this.drawSelectionRange();
  }

  setSpellPosition(position: Vector) {
    this.position = position;

    this.highlightUnitSelection();
    this.drawSelectionRange();
  }

  stopSpellSelection(cast: boolean) {
    if (!this.spellId || !this.position) return;

    if (cast) {
      this.battlefield.spellsContext.castSpell(this.spellId, this.position);
    }

    this.position = null;
    this.spellId = null;

    this.clearSelectionRange();
    this.highlightUnitSelection();
  }

  private highlightUnitSelection() {
    if (!this.position) return;

    let units: Unit[] = [];
    if (this.spellId) {
      units = this.battlefield.spellsContext.getTargetUnits(this.spellId, this.position);
    } else {
      units = [];
    }

    this.renderer.selectUnits(units);
  }

  private drawSelectionRange() {
    if (!this.spellId || !this.position) return;

    const spellRange = this.battlefield.spellsContext.getSpellRange(this.spellId);

    this.clearSelectionRange();
    this.circleGraphics.alpha = 0.1;
    this.circleGraphics.circle(this.position.x, this.position.y, spellRange).fill(0xffffff);
  }

  private clearSelectionRange() {
    this.circleGraphics.clear();
  }
}
