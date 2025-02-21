import { find, groupBy, mapObjIndexed, propEq, sum, values } from "rambda";

import { merge } from "../utils";
import { Context } from "./context";
import {
  ArmorEffect,
  AuraEffect,
  DmgEffect,
  DmgType,
  DotEffect,
  Effect,
  EffectSource,
  EffectType,
  HealEffect,
  Unit,
  UnitSetup,
} from "./interface";
import { filterBySeekConditions } from "./utils/unit-filter";

export class EffectsContext {
  constructor(private context: Context) {}

  tickEffects(): void {
    const aliveUnits = this.context.unit.units.filter(x => x.hp > 0);

    for (let unit of aliveUnits) {
      this.context.unit.triggerDotEffects(unit);
    }

    for (let unit of aliveUnits) {
      this.flagToClearAuraEffects(unit);
    }

    for (let unit of aliveUnits) {
      this.triggerAura(unit, this.context.unit.units);
    }

    for (let unit of aliveUnits) {
      this.clearAuraEffects(unit);
    }
  }

  applyEffect(effects: Effect[], targetUnit: Unit) {
    const dmgEffects = effects.filter(x => x.type === EffectType.Dmg) as DmgEffect[];
    if (dmgEffects.length) {
      this.dmg(targetUnit, dmgEffects);
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

  private dmg(targetUnit: Unit, dmgEffects: { dmgType: DmgType; power: number | [number, number] }[]) {
    const armors = targetUnit.effects.filter(x => x.type === EffectType.Armor) as ArmorEffect[];

    const effectsByDmgType = groupBy(x => x.dmgType, dmgEffects);

    const totalDmgs = values(
      mapObjIndexed((effects, dmgType) => {
        const dmgArmors = armors.filter(x => x.dmgType === dmgType);
        const totalArmor = sum(dmgArmors.map(x => x.power));
        const totalDmg = sum(effects.map(x => (Array.isArray(x.power) ? this.context.random.int(x.power[0], x.power[1]) : x.power)));

        return Math.max(0, totalDmg - totalArmor);
      }, effectsByDmgType),
    );

    const totalDmg = sum(totalDmgs);

    if (totalDmg) {
      targetUnit.hp = Math.max(0, targetUnit.hp - totalDmg);
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

  private flagToClearAuraEffects(unit: Unit) {
    unit.effects.filter(x => x.source === EffectSource.Aura).forEach(x => (x.toClear = true));
  }

  private clearAuraEffects(unit: Unit) {
    unit.effects = unit.effects.filter(x => !(x.source === EffectSource.Aura && x.toClear === true));
  }

  private triggerAura(unit: Unit, units: Unit[]) {
    const auras = unit.effects.filter(x => x.type === EffectType.Aura) as AuraEffect[];

    if (auras.length > 0) {
      auras.forEach(aura => this.applyAura(unit, aura, units));
    }
  }

  private applyAura(unit: Unit, aura: AuraEffect, units: Unit[]) {
    const auraTargets = filterBySeekConditions(units, [...aura.seekTargetCondition, ["in-distance", { distance: aura.range }]], {
      targetLocation: unit.location,
      team: unit.team,
    });

    auraTargets.forEach(unit => {
      const uniqueIdEffect = aura.effect.uniqueId && unit.effects.find(x => x.uniqueId === aura.effect.uniqueId);

      if (uniqueIdEffect) {
        if (uniqueIdEffect.type == EffectType.Dot && uniqueIdEffect.state) {
          uniqueIdEffect.state.remainingPeriod = uniqueIdEffect.period;
        }
        uniqueIdEffect.toClear = false;
      } else {
        unit.effects = [...unit.effects, { ...aura.effect, source: EffectSource.Aura, toClear: false }];
      }
    });
  }
}
