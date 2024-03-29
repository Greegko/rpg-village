import { createSelector } from "@reduxjs/toolkit";
import { filter, find, values } from "rambda";
import { useSelector } from "react-redux";

import {
  Activity,
  ActivityID,
  ActivityType,
  GameState,
  MapID,
  MapLocationID,
  Party,
  PartyID,
  PartyOwner,
  UnitID,
  calculateUnitStatsWithEffects,
  isHero,
} from "@rpg-village/core";

import { GameStoreState } from "../game-store-state";

const gameStoreStateSelector = (storeState: GameStoreState) => storeState.game;
const gameStateSelf = (game: GameState) => game;

const selectorProperty =
  <P>() =>
  (...args: [GameState, P]): P =>
    args[1];

export const worldMapIdSelector = (game: GameState) => game.general.worldMapId;

export const mapsSelector = (game: GameState) => game.maps;
export const mapByMapIdSelector = createSelector(mapsSelector, selectorProperty<MapID>(), (maps, mapId) => maps[mapId]);
export const mapLocationsSelector = (game: GameState) => game.mapLocations;
export const mapLocationByIdSelector = createSelector(
  mapLocationsSelector,
  selectorProperty<MapLocationID>(),
  (mapLocations, mapLocationId) => mapLocations[mapLocationId],
);
export const mapLocationsByMapLocationIdSelector = createSelector(
  gameStateSelf,
  selectorProperty<MapLocationID>(),
  (gameState, mapLocationId) => {
    const map = mapByMapLocationIdSelector(gameState, mapLocationId);
    return mapLocationsByMapIdSelector(gameState, map!.id);
  },
);

export const mapLocationByPartyIdSelector = createSelector(
  mapLocationsSelector,
  selectorProperty<PartyID>(),
  (mapLocations, partyId) => find(x => x.partyIds.includes(partyId), values(mapLocations))!,
);

export const mapLocationsByMapIdSelector = createSelector(mapLocationsSelector, mapByMapIdSelector, (locations, map) =>
  map?.mapLocationIds.map((locationId: MapLocationID) => locations[locationId]),
);

export const mapByMapLocationIdSelector = createSelector(
  mapsSelector,
  selectorProperty<MapLocationID>(),
  (maps, mapLocationId) => find(x => x.mapLocationIds.includes(mapLocationId), values(maps)),
);

export const entryPortalLocationForMapSelector = createSelector(mapByMapIdSelector, x => x.mapLocationIds[0]);

export const unitsSelector = (game: GameState) => game.units;
export const unitByIdSelector = createSelector(unitsSelector, selectorProperty<UnitID>(), (units, unitId) =>
  calculateUnitStatsWithEffects(units[unitId]),
);
export const heroUnitsSelector = createSelector(unitsSelector, units => filter(isHero, units));

export const villageSelector = (game: GameState) => game.village;

export const shopsSelector = (game: GameState) => game.shops;
export const villageShopSelector = createSelector(shopsSelector, villageSelector, (shops, village) =>
  village.shop ? shops[village.shop.shopId] : undefined,
);

export const partiesSelector = (game: GameState) => game.parties;
export const partyByIdSelector = createSelector(
  partiesSelector,
  selectorProperty<PartyID>(),
  (parties, partyId) => parties[partyId],
);

export const partiesOnLocationSelector = createSelector(
  mapLocationsSelector,
  partiesSelector,
  selectorProperty<MapLocationID>(),
  (mapLocations, parties, mapLocationId) => {
    const partyIds = mapLocations[mapLocationId].partyIds;

    return partyIds.map(partyId => parties[partyId]);
  },
);

export const playerPartiesSelector = createSelector(partiesSelector, parties =>
  filter(party => party.owner === PartyOwner.Player, parties),
);

export const mapByPartyIdSelector = createSelector(gameStateSelf, selectorProperty<PartyID>(), (gameState, partyId) =>
  mapByMapLocationIdSelector(gameState, mapLocationByPartyIdSelector(gameState, partyId).id),
);

export const activitiesSelector = (game: GameState) => game.activities;
export const activityByIdSelector = createSelector(
  activitiesSelector,
  selectorProperty<ActivityID>(),
  (activities, activityID) => activities[activityID],
);

export const villageActivitiesSelector = createSelector(activitiesSelector, activities =>
  filter(activity => activity.type === ActivityType.Global, values(activities)),
);

export const partyActivitiesSelector = createSelector(activitiesSelector, activities =>
  filter((activity: Activity) => activity.type === ActivityType.Party, activities),
);

export const noActiveActivityPartiesSelector = createSelector(playerPartiesSelector, parties =>
  filter((party: Party) => party.activityId === undefined, parties),
);

export const generalSelector = (game: GameState) => game.general;

/** React Hook Adaptation */

export const useGameStateSelector = <T extends (gameState: GameState) => any>(selector: T): ReturnType<T> =>
  useSelector(createSelector(gameStoreStateSelector, selector));
