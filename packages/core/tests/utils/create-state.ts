import { Party, PartyID, VillageState, MapLocationID, PartyOwner, GameState, MapLocation, MapLocationType, Unit, UnitType, UnitID, BattleStoreState, BattleID } from "../../src";
import { PartyActivity, ActivityID } from "../../src/modules/activity";
import { ItemStash, ResourceStash } from "../../src/models/stash";
import { Chance } from 'chance';
import { PartialDeep } from "./deep-partial";

const chance = Chance();

interface CreateStateCallbackArgs {
  battle: (battleArgs: PartialDeep<BattleStoreState>) => BattleID;
  party: (partyArgs: PartialDeep<Party>) => PartyID;
  activity: (activityArgs: PartialDeep<PartyActivity>) => ActivityID;
  village: (villageargs?: PartialDeep<VillageState>) => MapLocationID;
  location: (locationArgs?: PartialDeep<MapLocation>) => MapLocationID;
  unit: (unitArgs?: PartialDeep<Unit>) => UnitID;
}

type Callback = (callbackArgs: CreateStateCallbackArgs) => any[];

function createInitState(): GameState {
  return {
    battle: {},
    parties: {},
    world: {},
    village: villageFactory(),
    units: {},
    general: { turn: 0 },
    activities: {},
  };
}

function createCallback(createdState: GameState) {
  function createLocationReference(locationArgs?: Partial<MapLocation>) {
    const location = mapLocationFactory(locationArgs);

    createdState.world[location.id] = location;

    return location.id;
  }

  function createUnitRefrence(unitArgs?: Partial<Unit>) {
    const unit = unitFactory(unitArgs);

    createdState.units[unit.id] = unit;

    return unit.id;
  }

  function createPartyReference(partyArgs: Partial<Party>) {
    const party = partyFactory(partyArgs);

    createdState.parties[party.id] = party;

    return party.id;
  }

  function createVillageReference(villageArgs?: Partial<VillageState>) {
    const village = villageFactory(villageArgs);

    createdState.village = village;

    return createLocationReference({ id: village.locationId, type: MapLocationType.Village, x: 0, y: 0 });
  }

  function createActivityReference(activityArgs: Partial<PartyActivity>) {
    const activity = activityFactory(activityArgs);

    createdState.activities[activity.id] = activity;

    return activity.id;
  }

  function createBattleReference(battleArgs: Partial<BattleStoreState>) {
    const battle = battleFactory(battleArgs);

    createdState.battle[battle.id] = battle;

    return battle.id;
  }

  return {
    battle: createBattleReference,
    party: createPartyReference,
    location: createLocationReference,
    village: createVillageReference,
    activity: createActivityReference,
    unit: createUnitRefrence
  }
}

export function createState(callback: Callback): GameState {
  const createdState: GameState = createInitState();

  callback(createCallback(createdState));

  return createdState;
}

function mapLocationFactory({
  explored = chance.bool(),
  x = chance.integer(),
  y = chance.integer(),
  id = chance.string(),
  type = MapLocationType.Field
}: Partial<MapLocation> = {}): MapLocation {
  return { explored, x, y, id, type };
}

export function stashFactory({
  resource = { gold: chance.integer() },
  items = []
} = {}): ItemStash & ResourceStash {
  return {
    items,
    resource
  }
}

function unitFactory({
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
  skillIds = [],
  type = chance.pickone[UnitType.Common, UnitType.Hero]
}: Partial<Unit> = {}): Unit {
  return { xp, id, stash, maxhp, hp, equipment, armor, level, name, type, dmg, skillIds };
}

function villageFactory({
  heroes = [],
  houses = chance.integer(),
  stash = stashFactory(),
  locationId = chance.string()
}: Partial<VillageState> = {}): VillageState {
  return { locationId, stash, houses, heroes };
}

function partyFactory({
  id = chance.string(),
  owner = chance.pickone([PartyOwner.Enemy, PartyOwner.Player]),
  unitIds = [],
  locationId = chance.string(),
  stash = stashFactory()
}: Partial<Party> = {}): Party {
  return { id, owner, unitIds, locationId, stash }
}

function activityFactory({
  id = chance.string(),
  state = {},
  type = chance.string()
}: Partial<PartyActivity> = {}): PartyActivity {
  return { id, state, type };
}

function battleFactory({
  id = chance.string(),
  attackerPartyId = chance.string(),
  defenderPartyId = chance.string(),
}: Partial<BattleStoreState> = {}) {
  return { id, attackerPartyId, defenderPartyId };
}
