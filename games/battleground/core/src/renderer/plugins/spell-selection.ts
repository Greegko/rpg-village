import { Graphics } from "pixi.js";

import { Position } from "@rpg-village/utils/node";

import { SpellID } from "@/features/spell";
import { Unit } from "@/features/unit";

import { Battlefield } from "../../battlefield";
import { BattlefieldRenderer } from "../battlefield-renderer";
import { inject, injectable } from "../injection-container";

@injectable()
export class SpellSelection {
  private circleGraphics = new Graphics();
  private spellId: SpellID | null = null;
  private position: Position | null = null;

  private renderer = inject(BattlefieldRenderer);
  private battlefield = inject(Battlefield);

  init() {
    this.renderer.addChild(this.circleGraphics);
  }

  startSpellSelection(spellId: SpellID, position: Position) {
    this.spellId = spellId;
    this.position = position;

    this.highlightUnitSelection();
    this.drawSelectionRange();
  }

  setSpellPosition(position: Position) {
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
