import { Party, PartyID, VillageState, MapLocationID, PartyOwner, WithID, GameState, MapLocation, MapLocationType, Unit, UnitType, UnitID } from "../../src";
import { AnyActivity, ActivityID } from "../../src/modules/activity";
import { ItemStash, ResourceStash } from "../../src/models/stash";

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

function mapLocationFactory({ explored = false, x = 0, y = 0, id = 'random-id', type = MapLocationType.Desert }: Partial<WithID<MapLocation>> = {}): WithID<MapLocation> {
  return { explored, x, y, id, type };
}

function stashFactory(): ItemStash & ResourceStash {
  return {
    items: [],
    resource: {}
  }
}

function unitFactory({ xp = 0, id = 'random-id', stash = stashFactory(), maxhp = 100, hp = 100, equipment = {}, armor = 0, dmg = 1, level = 1, name = 'random-name', skillIds = [], type = UnitType.Common }: Partial<WithID<Unit>> = {}): WithID<Unit> {
  return { xp, id, stash, maxhp, hp, equipment, armor, level, name, type, dmg, skillIds };
}

function villageFactory({ heroes = [], houses = 0, stash = stashFactory(), locationId = 'random-id' }: Partial<VillageState> = {}): VillageState {
  return { locationId, stash, houses, heroes };
}

function partyFactory({ id = 'random-id', owner = PartyOwner.Player, unitIds = [], locationId = 'random-id', stash = stashFactory() }: Partial<WithID<Party>> = {}): WithID<Party> {
  return { id, owner, unitIds, locationId, stash }
}

function activityFactory({ id = 'random-id', state = {}, type = 'meh' }: Partial<WithID<AnyActivity>> = {}): WithID<AnyActivity> {
  return { id, state, type };
}
