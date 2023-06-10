import { Chance } from "chance";

import { Activity, ActivityType } from "@features/activity";
import { BattleStoreState } from "@features/battle";
import { Party, PartyOwner } from "@features/party";
import { Unit, UnitType } from "@features/unit";
import { Armor, ItemStash, ItemType, ResourceStash, Rune, Shield, Weapon } from "@models";
import { GeneralGameStoreState } from "@modules/game";
import { Map, MapLocation, MapLocationType, MapSize } from "@modules/map";
import { OptionState } from "@modules/options";
import { ShopState } from "@modules/shop";
import { VillageState } from "@modules/village";

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

export function shopFactory({ id = chance.string(), items = [] }: Partial<ShopState> = {}): ShopState {
  return { id, items };
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
} = {}): ItemStash & ResourceStash {
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
  heroes = [],
  houses = chance.integer(),
  stash = stashFactory(),
  locationId = chance.string(),
  blacksmith = chance.integer(),
  trainingField = chance.integer(),
  runeWorkshop = chance.integer(),
  portals = chance.integer(),
  shop = { shopId: chance.string(), level: chance.integer() },
}: Partial<VillageState> = {}): VillageState {
  return { locationId, stash, houses, heroes, blacksmith, trainingField, runeWorkshop, portals, shop };
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
  type = chance.pickone([ActivityType.Global, ActivityType.Party]),
  startArgs = {} as any,
}: Partial<Activity> = {}): Activity {
  return { id, state, type, name, startArgs } as Activity<unknown>;
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
