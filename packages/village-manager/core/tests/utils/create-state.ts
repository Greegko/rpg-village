import { ActivityID, AnyActivity } from "@rpg-village/features/activity";

import { GameState } from "@rpg-village/core";
import { GeneralGameStoreState } from "@rpg-village/core/features/game";

import { BattleID, BattleStoreState } from "@rpg-village/village-manager/features/battle";
import { Map, MapID, MapLocation, MapLocationID, MapLocationType } from "@rpg-village/village-manager/features/map";
import { OptionID, OptionState } from "@rpg-village/village-manager/features/options";
import { Party, PartyID } from "@rpg-village/village-manager/features/party";
import { Unit, UnitID } from "@rpg-village/village-manager/features/unit";
import { VillageState } from "@rpg-village/village-manager/features/village";

import {
  activityFactory,
  battleStoreStateFactory,
  generalStateFactory,
  mapFactory,
  mapLocationFactory,
  optionFactory,
  partyFactory,
  unitFactory,
  villageFactory,
} from "./factories";
import { PartialDeep } from "./partial-deep";

interface CreateStateCallbackArgs {
  battle: (battleArgs: PartialDeep<BattleStoreState>) => BattleID;
  party: (partyArgs: PartialDeep<Party>) => PartyID;
  activity: (activityArgs: PartialDeep<AnyActivity>) => ActivityID;
  village: (villageArgs?: PartialDeep<VillageState>) => MapLocationID;
  map: (mapArgs?: PartialDeep<Map>) => MapID;
  location: (locationArgs?: PartialDeep<MapLocation>) => MapLocationID;
  unit: (unitArgs?: PartialDeep<Unit>) => UnitID;
  option: (optionArgs?: PartialDeep<OptionState>) => OptionID;
  general: (generalArgs?: PartialDeep<GeneralGameStoreState>) => undefined;
}

type Callback = (callbackArgs: CreateStateCallbackArgs) => any[];

function createInitState(): GameState {
  return {
    general: generalStateFactory(),
    battle: {},
    parties: {},
    villages: {},
    units: {},
    activities: {},
    maps: {},
    options: {},
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

  function createOptionReference(optionArgs?: Partial<OptionState>) {
    const option = optionFactory(optionArgs);

    createdState.options[option.id] = option;

    return option.id;
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

    createdState.villages[village.id] = village;

    createLocationReference({
      id: village.locationId,
      type: MapLocationType.Village,
      x: 0,
      y: 0,
    });

    return village.locationId;
  }

  function createActivityReference(activityArgs: Partial<AnyActivity>) {
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
    option: createOptionReference,
    general: createGeneralCallback,
  };
}

export function createState(callback: Callback): GameState {
  const createdState: GameState = createInitState();

  callback(createCallback(createdState) as CreateStateCallbackArgs);

  return createdState;
}
