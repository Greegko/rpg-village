import { Chance } from "chance";

import { GeneralGameStoreState, Map, MapLocation, Party, PartyOwner, VillageState } from "../../public-api";
import { BattleStoreState, ItemStash, PartyActivity, ResourceStash } from "../../public-api";
import { ActivityType, Armor, ItemType, MapLocationType, Shield, Unit, UnitType, Weapon } from "../../public-api";

const chance = Chance();

export function mapFactory({
  id = chance.string(),
  difficulty = chance.integer(),
  mapLocationIds = [],
}: Partial<Map> = {}): Map {
  return { difficulty, id, mapLocationIds };
}

export function mapLocationFactory({
  explored = chance.bool(),
  x = chance.integer(),
  y = chance.integer(),
  id = chance.string(),
  type = MapLocationType.Field,
}: Partial<MapLocation> = {}): MapLocation {
  return { explored, x, y, id, type };
}

export function stashFactory({ resource = { gold: chance.integer() }, items = [] } = {}): ItemStash & ResourceStash {
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
}: Partial<VillageState> = {}): VillageState {
  return { locationId, stash, houses, heroes, blacksmith, trainingField, runeWorkshop, portals };
}

export function partyFactory({
  id = chance.string(),
  owner = chance.pickone([PartyOwner.Enemy, PartyOwner.Player]),
  unitIds = [],
  locationId = chance.string(),
  stash = stashFactory(),
}: Partial<Party> = {}): Party {
  return { id, owner, unitIds, locationId, stash };
}

export function activityFactory({
  id = chance.string(),
  state = {},
  name = chance.string(),
  type = ActivityType.Party,
  startArgs = {} as any,
}: Partial<PartyActivity> = {}): PartyActivity {
  return { id, state, type, name, startArgs } as PartyActivity<unknown>;
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
}: Partial<Armor | Shield | Weapon>): Armor | Shield | Weapon {
  return { effects, id, name, itemType };
}

export function generalStateFactory({
  turn = 0,
  worldMapId = chance.string(),
}: Partial<GeneralGameStoreState> = {}): GeneralGameStoreState {
  return { turn, worldMapId };
}
