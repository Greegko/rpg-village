import {
  Party,
  PartyID,
  VillageState,
  MapLocationID,
  GameState,
  MapLocation,
  GeneralGameStoreState,
  Map,
  MapID,
} from "../../public-api";
import { UnitID, BattleStoreState, BattleID, PartyActivity } from "../../public-api";
import { MapLocationType, Unit, ActivityID } from "../../public-api";
import { PartialDeep } from "./partial-deep";
import {
  mapLocationFactory,
  unitFactory,
  villageFactory,
  partyFactory,
  activityFactory,
  battleStoreStateFactory,
  generalStateFactory,
  mapFactory,
} from "./factories";

interface CreateStateCallbackArgs {
  battle: (battleArgs: PartialDeep<BattleStoreState>) => BattleID;
  party: (partyArgs: PartialDeep<Party>) => PartyID;
  activity: (activityArgs: PartialDeep<PartyActivity>) => ActivityID;
  village: (villageArgs?: PartialDeep<VillageState>) => MapLocationID;
  map: (mapArgs?: PartialDeep<Map>) => MapID;
  location: (locationArgs?: PartialDeep<MapLocation>) => MapLocationID;
  unit: (unitArgs?: PartialDeep<Unit>) => UnitID;
  general: (generalArgs?: PartialDeep<GeneralGameStoreState>) => undefined;
}

type Callback = (callbackArgs: CreateStateCallbackArgs) => any[];

function createInitState(): GameState {
  return {
    battle: {},
    parties: {},
    village: villageFactory(),
    units: {},
    general: generalStateFactory(),
    activities: {},
    maps: {},
    mapLocations: {},
  };
}

function createCallback(createdState: GameState) {
  function createLocationReference(locationArgs?: Partial<MapLocation>) {
    const location = mapLocationFactory(locationArgs);

    createdState.mapLocations[location.id] = location;

    return location.id;
  }

  function createMapReference(mapArgs?: Partial<Map>) {
    const map = mapFactory(mapArgs);

    createdState.maps[map.id] = map;

    return map.id;
  }

  function createUnitReference(unitArgs?: Partial<Unit>) {
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

    return createLocationReference({
      id: village.locationId,
      type: MapLocationType.Village,
      x: 0,
      y: 0,
    });
  }

  function createActivityReference(activityArgs: Partial<PartyActivity>) {
    const activity = activityFactory(activityArgs);

    createdState.activities[activity.id] = activity;

    return activity.id;
  }

  function createBattleReference(battleArgs: Partial<BattleStoreState>) {
    const battle = battleStoreStateFactory(battleArgs);

    createdState.battle[battle.id] = battle;

    return battle.id;
  }

  function createGeneralCallback(generalArgs: Partial<GeneralGameStoreState>) {
    createdState.general = generalStateFactory(generalArgs);

    return undefined;
  }

  return {
    battle: createBattleReference,
    party: createPartyReference,
    map: createMapReference,
    location: createLocationReference,
    village: createVillageReference,
    activity: createActivityReference,
    unit: createUnitReference,
    general: createGeneralCallback,
  };
}

export function createState(callback: Callback): GameState {
  const createdState: GameState = createInitState();

  callback(createCallback(createdState) as CreateStateCallbackArgs);

  return createdState;
}
