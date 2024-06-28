import { find, propEq } from "rambda";

import { DmgEffect, DotEffect, Effect, EffectType, HealEffect, Unit, UnitSetup } from "../interface";
import { merge } from "../utils";
import { Context } from "./context";

export class EffectsContext {
  constructor(private context: Context) {}

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
      ...dotEffects.map(x => ({ ...x, state: { intervalState: x.interval, remainingPeriod: x.period } } as DotEffect)),
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
