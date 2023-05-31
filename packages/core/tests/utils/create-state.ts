import { GameState } from "@core";

import { Unit, UnitID } from "@features/unit";
import { Activity, ActivityID } from "@modules/activity";
import { BattleID, BattleStoreState } from "@modules/battle";
import { GeneralGameStoreState } from "@modules/game";
import { Map, MapID, MapLocation, MapLocationID, MapLocationType } from "@modules/map";
import { OptionID, OptionState } from "@modules/options";
import { Party, PartyID } from "@modules/party";
import { ShopID, ShopState } from "@modules/shop";
import { VillageState } from "@modules/village";

import {
  activityFactory,
  battleStoreStateFactory,
  generalStateFactory,
  mapFactory,
  mapLocationFactory,
  optionFactory,
  partyFactory,
  shopFactory,
  unitFactory,
  villageFactory,
} from "./factories";
import { PartialDeep } from "./partial-deep";

interface CreateStateCallbackArgs {
  battle: (battleArgs: PartialDeep<BattleStoreState>) => BattleID;
  party: (partyArgs: PartialDeep<Party>) => PartyID;
  activity: <S, A>(activityArgs: PartialDeep<Activity<S, A>>) => ActivityID;
  village: (villageArgs?: PartialDeep<VillageState>) => MapLocationID;
  map: (mapArgs?: PartialDeep<Map>) => MapID;
  location: (locationArgs?: PartialDeep<MapLocation>) => MapLocationID;
  unit: (unitArgs?: PartialDeep<Unit>) => UnitID;
  shop: (shopArgs?: PartialDeep<ShopState>) => ShopID;
  option: (optionArgs?: PartialDeep<OptionState>) => OptionID;
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
    shops: {},
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

  function createShopReference(shopArgs?: Partial<ShopState>) {
    const shop = shopFactory(shopArgs);

    createdState.shops[shop.id] = shop;

    return shop.id;
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

    createdState.village = village;

    createLocationReference({
      id: village.locationId,
      type: MapLocationType.Village,
      x: 0,
      y: 0,
    });

    return village.locationId;
  }

  function createActivityReference(activityArgs: Partial<Activity>) {
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
    shop: createShopReference,
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
