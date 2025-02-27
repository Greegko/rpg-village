import { inject, injectable } from "../injection-container";
import { DmgType, EffectType, Position, Spell, SpellID, Unit } from "../interface";
import { filterBySeekConditions } from "../utils/unit-filter";
import { EffectsContext } from "./effects";
import { UnitContext } from "./unit";

@injectable()
export class SpellsContext {
  private unitContext = inject(UnitContext);
  private effectsContext = inject(EffectsContext);

  private spells: Record<SpellID, Spell> = {
    heal: {
      seekConditions: ["same-team", "alive", "damaged", ["in-distance", { distance: 200 }]],
      effects: [{ type: EffectType.Heal, power: 100 }],
    },
    fireball: {
      seekConditions: ["enemy-team", "alive", ["in-distance", { distance: 100 }]],
      effects: [{ type: EffectType.Dmg, dmgType: DmgType.Pure, power: 100 }],
    },
    shieldBreak: {
      seekConditions: ["enemy-team", "alive", ["in-distance", { distance: 100 }]],
      addEffects: [{ type: EffectType.Armor, dmgType: DmgType.Physical, power: -10 }],
    },
    lightning: {
      seekConditions: ["enemy-team", "alive", ["in-distance", { distance: 20 }], "closest-unit"],
      effects: [{ type: EffectType.Dmg, dmgType: DmgType.Pure, power: 1000 }],
    },
  };

  getTargetUnits(spellId: SpellID, targetLocation: Position): Unit[] {
    const spell = this.spells[spellId];
    const spellContext = this.getSpellContext();

    return filterBySeekConditions(this.unitContext.units, spell.seekConditions, {
      targetLocation,
      ...spellContext,
    });
  }

  castSpell(spellId: SpellID, targetLocation: Position): void {
    const spell = this.spells[spellId];
    const spellContext = this.getSpellContext();

    const targets = filterBySeekConditions(this.unitContext.units, spell.seekConditions, {
      targetLocation,
      ...spellContext,
    });

    if (spell.effects) {
      const effect = spell.effects;
      targets.forEach(targetUnit => this.effectsContext.applyEffect(effect, targetUnit));
    }

    if (spell.addEffects) {
      const addEffects = spell.addEffects;
      targets.forEach(targetUnit => (targetUnit.effects = [...targetUnit.effects, ...addEffects]));
    }
  }

  getSpellRange(spellId: SpellID): number {
    const distanceCondition = this.spells[spellId].seekConditions.find(seekCondition => seekCondition[0] === "in-distance");

    if (!distanceCondition) return 0;

    return (distanceCondition[1] as { distance: number }).distance;
  }

  private getSpellContext(): object {
    return {
      team: 1,
    };
  }
}
