import { Party, VillageState, PartyOwner, MapLocation, GeneralGameStoreState } from "../../public-api";
import { BattleStoreState, ItemStash, ResourceStash, PartyActivity } from "../../public-api";
import { MapLocationType, Unit, UnitType, ActivityType, Item, ItemType } from "../../public-api";
import { Chance } from "chance";

const chance = Chance();

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
}: Partial<VillageState> = {}): VillageState {
  return { locationId, stash, houses, heroes, blacksmith, trainingField };
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

export function itemFactory({
  effects = [],
  id = chance.string(),
  name = chance.string(),
  itemType = chance.pickone([ItemType.Armor, ItemType.Shield, ItemType.Weapon]),
}: Partial<Item>): Item {
  return { effects, id, name, itemType };
}

export function generalStateFactory({
  turn = 0,
  difficulty = 0,
}: Partial<GeneralGameStoreState> = {}): GeneralGameStoreState {
  return { turn, difficulty };
}
