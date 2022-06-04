import { createSelector } from "@reduxjs/toolkit";
import { filter, find, groupBy, values } from "ramda";

import {
  Activity,
  ActivityType,
  GameState,
  MapID,
  MapLocationID,
  Party,
  PartyID,
  PartyOwner,
  isHero,
} from "@rpg-village/core";

export const gameStateSelector = (game: GameState) => game;

export const worldMapIdSelector = (game: GameState) => game.general.worldMapId;

export const mapsSelector = (game: GameState) => game.maps;
export const mapByMapIdSelector = createSelector(
  mapsSelector,
  (state: GameState, mapId: MapID) => mapId,
  (maps, mapId) => maps[mapId],
);
export const mapLocationsSelector = (game: GameState) => game.mapLocations;
export const mapLocationByIdSelector = createSelector(
  mapLocationsSelector,
  (gameState: GameState, mapLocationId: MapLocationID) => mapLocationId,
  (mapLocations, mapLocationId) => mapLocations[mapLocationId],
);
export const mapLocationsByMapLocationIdSelector = createSelector(
  mapLocationsSelector,
  gameStateSelector,
  (gameState: GameState, mapLocationId: MapLocationID) => mapLocationId,
  (mapLocations, gameState, mapLocationId) => {
    const map = mapByMapLocationIdSelector(gameState, mapLocationId);
    return mapLocationsByMapIdSelector(gameState, map.id);
  },
);

export const mapLocationsByMapIdSelector = createSelector(mapLocationsSelector, mapByMapIdSelector, (locations, map) =>
  map.mapLocationIds.map((locationId: MapLocationID) => locations[locationId]),
);

export const mapByMapLocationIdSelector = createSelector(
  mapsSelector,
  (game: GameState, mapLocationId: MapLocationID) => mapLocationId,
  (maps, mapLocationId) => find(x => x.mapLocationIds.includes(mapLocationId), values(maps)),
);

export const unitsSelector = (game: GameState) => game.units;
export const heroUnitsSelector = createSelector(unitsSelector, filter(isHero));

export const villageSelector = (game: GameState) => game.village;

export const partiesSelector = (game: GameState) => game.parties;
export const partyByIdSelector = createSelector(
  partiesSelector,
  (game: GameState, partyId: PartyID) => partyId,
  (parties, partyId) => parties[partyId],
);

export const playerPartiesSelector = createSelector(partiesSelector, parties =>
  filter(party => party.owner === PartyOwner.Player, parties),
);
export const mapByPartyIdSelector = createSelector(gameStateSelector, partyByIdSelector, (gameState, party) =>
  mapByMapLocationIdSelector(gameState, party.locationId),
);

export const partiesGroupedOnLocationsSelector = createSelector(
  partiesSelector,
  parties => groupBy(party => party.locationId, values(parties)) as Record<MapLocationID, Party[]>,
);

export const activitiesSelector = (game: GameState) => game.activities;
export const partyActivitiesSelector = createSelector(
  activitiesSelector,
  filter((activity: Activity) => activity.type === ActivityType.Party),
);

export const idlePartiesSelector = createSelector(
  partiesSelector,
  filter((party: Party) => party.activityId === undefined),
);
