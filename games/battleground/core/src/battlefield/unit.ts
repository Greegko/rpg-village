import { clone, groupBy, mapObjIndexed, mergeRight, partition, sum, values, without } from "rambda";

import {
  Vector,
  addVector,
  divVector,
  getVectorDistance,
  invXVector,
  invYVector,
  isZeroVector,
  multVector,
  normVector,
  subVector,
} from "../utils";
import { Context } from "./context";
import {
  ArmorEffect,
  AuraEffect,
  DmgType,
  DotEffect,
  Effect,
  EffectSource,
  EffectType,
  Projectile,
  Unit,
  UnitInit,
  UnitState,
} from "./interface";
import { getUnitCentral, inTouchWithOthers } from "./utils";
import { filterBySeekConditions, isUnitActionHasValidTarget } from "./utils/unit-filter";

export class UnitContext {
  constructor(private context: Context) {}

  units: Unit[] = [];

  triggerActionState(unit: Unit) {
    for (let [action, cooldown] of unit.actionsCooldowns.entries()) {
      if (cooldown > 0) {
        unit.actionsCooldowns.set(action, cooldown - 1);
      }
    }

    if (unit.activeAction) {
      if (unit.activeAction.speed > 0) --unit.activeAction.speed;
    }
  }

  triggerDotEffects(unit: Unit) {
    const effects = unit.effects.filter(x => x.type === EffectType.Dot) as DotEffect[];

    const [oldEffects, newEffects] = partition(x => !!x.state, effects);

    oldEffects.forEach(effect => effect.state.intervalState--);

    const triggerEffects = oldEffects.filter(x => x.state.intervalState === 0);

    if (triggerEffects.length > 0) {
      this.context.effect.applyEffect(
        triggerEffects.map(x => x.effect),
        unit,
      );
    }

    const clearEffects: Effect[] = [];

    for (let effect of triggerEffects) {
      if (effect.state.remainingPeriod === 1) {
        clearEffects.push(effect);
      } else {
        effect.state.remainingPeriod--;
        effect.state.intervalState = effect.interval;
      }
    }

    for (let effect of newEffects) {
      effect.state = { remainingPeriod: effect.period, intervalState: effect.interval };
    }

    if (clearEffects.length > 0) {
      unit.effects = without(clearEffects, unit.effects);
    }
  }

  addUnit(unit: UnitInit) {
    const unitClone = clone(unit);

    const initUnitState: UnitState = {
      actionsCooldowns: new Map(unitClone.actions.map(action => [action, 0])),
      effects: unitClone.effects || [],
      hp: unitClone.hp ?? unitClone.maxHp,
    };

    this.units.push(mergeRight(unitClone, initUnitState));
  }

  moveUnit(unit: Unit) {
    if (!unit.moveSpeed) return;
    if (!unit.moveDirection) return;

    unit.location = addVector(unit.location, multVector(unit.moveDirection, unit.moveSpeed));
  }

  flagToClearAuraEffects(unit: Unit) {
    unit.effects.filter(x => x.source === EffectSource.Aura).forEach(x => (x.toClear = true));
  }

  clearAuraEffects(unit: Unit) {
    unit.effects = unit.effects.filter(x => !(x.source === EffectSource.Aura && x.toClear === true));
  }

  triggerAura(unit: Unit, units: Unit[]) {
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

  screenBoundaries(unit: Unit) {
    if (!unit.moveSpeed) return;
    if (!unit.moveDirection) return;

    const unitWidth = unit.size;

    const futurePoint = addVector(multVector(unit.moveDirection, unit.moveSpeed), unit.location);

    if (futurePoint.x > this.context.config.mapSize[0] - unitWidth || futurePoint.x < 0) {
      unit.moveDirection = invXVector(unit.moveDirection);
    }

    if (futurePoint.y > this.context.config.mapSize[1] - unitWidth || futurePoint.y < 0) {
      unit.moveDirection = invYVector(unit.moveDirection);
    }
  }

  executeAction(unit: Unit) {
    if (!unit.activeAction) return;
    if (unit.activeAction.targetUnit) {
      if (!isUnitActionHasValidTarget(unit, unit.activeAction.targetUnit, unit.activeAction.action)) {
        delete unit.activeAction;
        return;
      }

      const targetDistance = getVectorDistance(unit.location, unit.activeAction.targetUnit.location);

      if (unit.activeAction.action.distance && targetDistance > unit.activeAction.action.distance) {
        delete unit.activeAction;
        return;
      }
    }

    delete unit.moveDirection;

    if (unit.activeAction.speed > 0) return;
    if (!unit.activeAction.action) return;
    if (!unit.actionsCooldowns) return;
    if (unit.actionsCooldowns.get(unit.activeAction.action)! > 0) return;

    if (unit.activeAction.action.projectileId && (unit.activeAction.targetUnit || unit.activeAction.targetPosition)) {
      if (unit.activeAction.targetUnit) {
        this.shootProjectile(unit, getUnitCentral(unit.activeAction.targetUnit));
      } else if (unit.activeAction.targetPosition) {
        this.shootProjectile(unit, unit.activeAction.targetPosition);
      }
    } else {
      if (unit.activeAction.action.hitEffect && unit.activeAction.targetUnit) {
        this.context.effect.applyEffect(unit.activeAction.action.hitEffect, unit.activeAction.targetUnit);
      }

      if (unit.activeAction.action.effect) {
        this.context.effect.applyEffect(unit.activeAction.action.effect, unit);
      }
    }

    unit.actionsCooldowns.set(unit.activeAction.action, unit.activeAction.action.cooldown);

    delete unit.activeAction;
  }

  separation(unit: Unit, units: Unit[]) {
    if (!unit.moveSpeed) return;

    const otherUnitsInDistance = inTouchWithOthers(unit, units);
    let sumSubVector = otherUnitsInDistance.reduce((acc, curr) => addVector(acc, normVector(subVector(unit.location, curr.location))), {
      x: 0,
      y: 0,
    });

    if (otherUnitsInDistance.length > 0) {
      const direction = divVector(sumSubVector, otherUnitsInDistance.length);
      unit.moveDirection = isZeroVector(direction) ? this.context.random.vector() : direction;
    }
  }

  dmg(targetUnit: Unit, dmgEffects: { dmgType: DmgType; power: number | [number, number] }[]) {
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

  private shootProjectile(unit: Unit, target: Unit) {
    if (!unit.activeAction) return;

    const action = unit.activeAction.action;
    const targetLocation = getUnitCentral(target);
    const sourceLocation = getUnitCentral(unit);
    const time = Math.ceil(getVectorDistance(sourceLocation, targetLocation) / action.projectileSpeed!);

    const projectile: Projectile = {
      area: 1,
      effect: action.hitEffect!,
      projectileId: action.projectileId!,
      source: unit,
      sourceLocation,
      speed: action.projectileSpeed!,
      targetLocation,
      time,
      timeState: time,
    };

    this.context.map.addProjectile(projectile);
  }
}
