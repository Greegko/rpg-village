import { find, propEq } from "rambda";

import { merge } from "../utils";
import { Context } from "./context";
import { DmgEffect, DotEffect, Effect, EffectType, HealEffect, Unit, UnitSetup } from "./interface";

export class EffectsContext {
  constructor(private context: Context) {}

  tickEffects(): void {
    const aliveUnits = this.context.unit.units.filter(x => x.hp > 0);

    for (let unit of aliveUnits) {
      this.context.unit.triggerDotEffects(unit);
    }

    for (let unit of aliveUnits) {
      this.context.unit.flagToClearAuraEffects(unit);
    }

    for (let unit of aliveUnits) {
      this.context.unit.triggerAura(unit, this.context.unit.units);
    }

    for (let unit of aliveUnits) {
      this.context.unit.clearAuraEffects(unit);
    }
  }

  applyEffect(effects: Effect[], targetUnit: Unit) {
    const dmgEffects = effects.filter(x => x.type === EffectType.Dmg) as DmgEffect[];
    if (dmgEffects.length) {
      this.context.unit.dmg(targetUnit, dmgEffects);
    }

    if (find(propEq(EffectType.Review, "type"), effects)) {
      targetUnit.hp = targetUnit.maxHp;
    }

    if (find(propEq(EffectType.SpawnUnit, "type"), effects)) {
      this.spawnUnit(targetUnit);
    }

    const dotEffects = effects.filter(x => x.type === EffectType.Dot) as DotEffect[];
    targetUnit.effects.push(
      ...dotEffects.map(x => ({ ...x, state: { intervalState: x.interval, remainingPeriod: x.period } }) as DotEffect),
    );

    const healEffect = find(propEq(EffectType.Heal, "type"), effects) as HealEffect;
    if (healEffect) {
      targetUnit.hp = Math.min(targetUnit.hp + healEffect.power, targetUnit.maxHp);
    }
  }

  private spawnUnit(source: Unit) {
    const unitId = this.context.random.sample(["priest", "steam_dragon", "archer", "skeleton", "flag-bearer", "flag-bearer-fire-aura"]);

    const spawnedUnit = this.context.resourceManager.getUnitConfig(unitId);
    const skeletonState: UnitSetup = {
      location: { x: source.location.x + source.size / 2, y: source.location.y + source.size + 20 },
      team: source.team,
    };

    const unit = merge(spawnedUnit, skeletonState);

    this.context.unit.addUnit(unit);
  }
}
