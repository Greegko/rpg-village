import { Party, PartyID, VillageState, MapLocationID, PartyOwner, WithID, GameState, MapLocation, MapLocationType, Unit, UnitType, UnitID } from "../../src";
import { AnyActivity, ActivityID } from "../../src/modules/activity";
import { ItemStash, ResourceStash } from "../../src/models/stash";
import { Chance } from 'chance';

const chance = Chance();

interface CreateStateCallbackArgs {
  party: (partyArgs: Partial<WithID<Party>>) => PartyID;
  activity: (activityArgs: Partial<WithID<AnyActivity>>) => ActivityID;
  village: (villageargs?: Partial<VillageState>) => MapLocationID;
  location: (locationArgs?: Partial<WithID<MapLocation>>) => MapLocationID;
  unit: (unitArgs?: Partial<WithID<Unit>>) => UnitID;
}

type Callback = (callbackArgs: CreateStateCallbackArgs) => any[];

function createInitState(): GameState {
  return {
    parties: {},
    world: {},
    village: villageFactory(),
    units: {},
    general: { turn: 0 },
    activities: {},
  };
}

function createCallback(createdState: GameState) {
  function createLocationRefrence(locationArgs?: Partial<WithID<MapLocation>>) {
    const location = mapLocationFactory(locationArgs);

    createdState.world[location.id] = location;

    return location.id;
  }

  function createUnitRefrence(unitArgs?: Partial<WithID<Unit>>) {
    const unit = unitFactory(unitArgs);

    createdState.units[unit.id] = unit;

    return unit.id;
  }

  function createPartyRefrence(partyArgs: Partial<WithID<Party>>) {
    const party = partyFactory(partyArgs);

    createdState.parties[party.id] = party;

    return party.id;
  }

  function createVillageReference(villageArgs?: Partial<VillageState>) {
    const village = villageFactory(villageArgs);

    createdState.village = village;

    return createLocationRefrence({ id: village.locationId, type: MapLocationType.Village, x: 0, y: 0 });
  }

  function createActivityReference(activityArgs: Partial<WithID<AnyActivity>>) {
    const activity = activityFactory(activityArgs);

    createdState.activities[activity.id] = activity;

    return activity.id;
  }

  return {
    party: createPartyRefrence,
    location: createLocationRefrence,
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
}: Partial<WithID<MapLocation>> = {}): WithID<MapLocation> {
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
  maxhp = chance.integer({ min: hp }),
  equipment = {},
  armor = chance.integer(),
  dmg = chance.integer(),
  level = chance.integer(),
  name = chance.string(),
  skillIds = [],
  type = chance.pickone[UnitType.Common, UnitType.Unit]
}: Partial<WithID<Unit>> = {}): WithID<Unit> {
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
}: Partial<WithID<Party>> = {}): WithID<Party> {
  return { id, owner, unitIds, locationId, stash }
}

function activityFactory({
  id = chance.string(),
  state = {},
  type = chance.string()
}: Partial<WithID<AnyActivity>> = {}): WithID<AnyActivity> {
  return { id, state, type };
}
