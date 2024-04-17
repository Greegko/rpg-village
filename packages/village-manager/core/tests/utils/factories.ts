import { Chance } from "chance";

import { GeneralGameStoreState } from "@rpg-village/core";

import { AnyActivity } from "@rpg-village/features/activity";

import { BattleStoreState } from "@rpg-village/village-manager/features/battle";
import { PortalSummoningStone } from "@rpg-village/village-manager/features/buildings/portal-summoning-stone";
import { Shop } from "@rpg-village/village-manager/features/buildings/shop";
import {
  AttackEffectType,
  DefenseEffectType,
  Effect,
  EffectDynamic,
  EffectStatic,
  EffectType,
  MiscEffectType,
  RuneAttackEffectType,
} from "@rpg-village/village-manager/features/effect";
import { Armor, ItemType, Rune, Shield, Weapon } from "@rpg-village/village-manager/features/item";
import { Map, MapLocation, MapLocationType, MapSize } from "@rpg-village/village-manager/features/map";
import { OptionState } from "@rpg-village/village-manager/features/options";
import { Party, PartyOwner } from "@rpg-village/village-manager/features/party";
import { Stash } from "@rpg-village/village-manager/features/stash";
import { Unit, UnitType } from "@rpg-village/village-manager/features/unit";
import { VillageState } from "@rpg-village/village-manager/features/village";

const chance = Chance();

export function mapFactory({
  id = chance.string(),
  difficulty = chance.integer(),
  mapLocationIds = [],
  mapSize = chance.pickone([MapSize.Small, MapSize.Endless]),
  modifiers = [],
}: Partial<Map> = {}): Map {
  return { difficulty, id, mapLocationIds, mapSize, modifiers };
}

export function portalSummoningStoreFactory({
  id = chance.string(),
  portals = [],
  level = chance.integer(),
}: Partial<PortalSummoningStone> = {}): PortalSummoningStone {
  return { id, portals, level };
}

export function shopFactory({
  level = chance.integer(),
  items = [],
  stash = stashFactory(),
}: Partial<Shop> = {}): Shop {
  return { level, items, stash };
}

export function optionFactory({ id = chance.string(), items = [] }: Partial<OptionState> = {}): OptionState {
  return { id, items };
}

export function mapLocationFactory({
  explored = chance.bool(),
  x = chance.integer(),
  y = chance.integer(),
  id = chance.string(),
  type = MapLocationType.Field,
  partyIds = [],
}: Partial<MapLocation> = {}): MapLocation {
  return { explored, x, y, id, type, partyIds };
}

export function stashFactory({
  resource = { gold: chance.integer(), soul: chance.integer() },
  items = [],
} = {}): Stash {
  return {
    items,
    resource,
  };
}

export function unitFactory({
  xp = chance.integer(),
  id = chance.string(),
  stash = stashFactory(),
  hp = chance.integer(),
  maxhp = chance.integer(),
  equipment = {},
  armor = chance.integer(),
  dmg = chance.integer(),
  level = chance.integer(),
  name = chance.string(),
  type = chance.pickone([UnitType.Common, UnitType.Hero]),
  effects = [],
  criticalChance = chance.integer(),
  evasion = chance.integer(),
}: Partial<Unit> = {}): Unit {
  return {
    xp,
    id,
    stash,
    maxhp,
    hp,
    equipment,
    armor,
    level,
    name,
    type,
    dmg,
    effects,
    criticalChance,
    evasion,
  };
}

export function villageFactory({
  id = chance.string(),
  heroes = [],
  stash = stashFactory(),
  locationId = chance.string(),
  buildings = {
    houses: chance.integer(),
    blacksmith: chance.integer(),
    trainingField: chance.integer(),
    runeWorkshop: chance.integer(),
    portalSummoningStone: portalSummoningStoreFactory(),
    shop: shopFactory(),
  },
}: Partial<VillageState> = {}): VillageState {
  return { id, locationId, stash, heroes, buildings };
}

export function partyFactory({
  id = chance.string(),
  owner = chance.pickone([PartyOwner.Enemy, PartyOwner.Player]),
  unitIds = [],
  stash = stashFactory(),
}: Partial<Party> = {}): Party {
  return { id, owner, unitIds, stash };
}

export function activityFactory({
  id = chance.string(),
  state = {},
  name = chance.string(),
  targetId = chance.string(),
  startArgs = {} as any,
  involvedTargetId = undefined,
}: Partial<AnyActivity> = {}): AnyActivity {
  return { id, state, name, startArgs, targetId, involvedTargetId } as AnyActivity;
}

export function battleStoreStateFactory({
  id = chance.string(),
  partyId = chance.string(),
  defenderPartyId = chance.string(),
}: Partial<BattleStoreState> = {}): BattleStoreState {
  return { id, partyId, defenderPartyId };
}

export function equipmentFactory({
  effects = [],
  id = chance.string(),
  name = chance.string(),
  itemType = chance.pickone([ItemType.Armor, ItemType.Shield, ItemType.Weapon]),
}: Partial<Armor | Weapon | Shield>): Armor | Weapon | Shield {
  return { effects, id, name, itemType };
}

export function effectFactory(): Effect {
  return chance.bool() ? staticEffectFactory({}) : dynamicEffectFactory({});
}

export function staticEffectFactory({
  value = chance.integer(),
  isPercentage = chance.bool(),
  effectType = chance.pickone([
    AttackEffectType.Dmg,
    DefenseEffectType.Armor,
    DefenseEffectType.Evasion,
    MiscEffectType.Hp,
  ]),
}: Partial<EffectStatic>): EffectStatic {
  return { value, type: EffectType.Static, effectType, isPercentage };
}

export function dynamicEffectFactory({
  isPercentage = chance.bool(),
  effectType = chance.pickone([RuneAttackEffectType.Dmg]),
}: Partial<EffectDynamic>): EffectDynamic {
  return { effectType, type: EffectType.Dynamic, isPercentage };
}

export function runeFactory({
  id = chance.string(),
  name = chance.string(),
  power = chance.integer(),
  soul = chance.integer(),
  effects = [],
}: Partial<Rune>): Rune {
  return { effects, id, name, itemType: ItemType.Rune, power, soul };
}

export function generalStateFactory({
  turn = 0,
  worldMapId = chance.string(),
}: Partial<GeneralGameStoreState> = {}): GeneralGameStoreState {
  return { turn, worldMapId };
}
