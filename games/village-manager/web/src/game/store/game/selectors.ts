import { filter, find, values } from "rambda";

import {
  ActivityID,
  GameState,
  MapID,
  MapLocationID,
  Party,
  PartyID,
  PartyOwner,
  UnitID,
  VillageID,
  calculateUnitStatsWithEffects,
  isHero,
} from "@rpg-village/village-manager-core";

import { createSelectorFactory, selectorProperty } from "../create-selector";

const createSelector = createSelectorFactory<GameState>();

const gameStateSelf = (game: GameState) => game;

export const worldMapIdSelector = (game: GameState) => game.general.worldMapId;
export const turnSelector = createSelector(gameStateSelf, x => x.general.turn);

export const mapsSelector = (game: GameState) => game.maps;
export const mapByMapIdSelector = createSelector(mapsSelector, selectorProperty<MapID>, (maps, mapId) => maps[mapId]);
export const mapLocationsSelector = (game: GameState) => game.mapLocations;
export const mapLocationByIdSelector = createSelector(
  mapLocationsSelector,
  selectorProperty<MapLocationID>,
  (mapLocations, mapLocationId) => mapLocations[mapLocationId],
);
export const mapLocationsByMapLocationIdSelector = createSelector(
  gameStateSelf,
  selectorProperty<MapLocationID>,
  (gameState, mapLocationId) => {
    const map = mapByMapLocationIdSelector(gameState, mapLocationId);
    return mapLocationsByMapIdSelector(gameState, map!.id);
  },
);

export const mapLocationByPartyIdSelector = createSelector(
  mapLocationsSelector,
  selectorProperty<PartyID>,
  (mapLocations, partyId) => find(x => x.partyIds.includes(partyId), values(mapLocations))!,
);

export const mapLocationsByMapIdSelector = createSelector(mapLocationsSelector, mapByMapIdSelector, (locations, map) =>
  map?.mapLocationIds.map((locationId: MapLocationID) => locations[locationId]),
);

export const mapByMapLocationIdSelector = createSelector(
  mapsSelector,
  selectorProperty<MapLocationID>,
  (maps, mapLocationId) => find(x => x.mapLocationIds.includes(mapLocationId), values(maps)),
);

export const entryPortalLocationForMapSelector = createSelector(mapByMapIdSelector, x => x.mapLocationIds[0]);

export const unitsSelector = (game: GameState) => game.units;
export const unitByIdSelector = createSelector(unitsSelector, selectorProperty<UnitID>, (units, unitId) =>
  calculateUnitStatsWithEffects(units[unitId]),
);
export const heroUnitsSelector = createSelector(unitsSelector, units => filter(isHero, units));

export const villagesSelector = (game: GameState) => game.villages;

export const villageByIdSelector = createSelector(
  villagesSelector,
  selectorProperty<VillageID>,
  (villages, villageId) => villages[villageId],
);

export const villageShopSelector = createSelector(villageByIdSelector, village => village.buildings.shop);

export const partiesSelector = (game: GameState) => game.parties;
export const partyByIdSelector = createSelector(
  partiesSelector,
  selectorProperty<PartyID>,
  (parties, partyId) => parties[partyId],
);

export const partiesOnLocationSelector = createSelector(
  mapLocationsSelector,
  partiesSelector,
  selectorProperty<MapLocationID>,
  (mapLocations, parties, mapLocationId) => {
    const partyIds = mapLocations[mapLocationId].partyIds;

    return partyIds.map(partyId => parties[partyId]);
  },
);

export const playerPartiesSelector = createSelector(partiesSelector, parties =>
  filter(party => party.owner === PartyOwner.Player, parties),
);

export const mapByPartyIdSelector = createSelector(gameStateSelf, selectorProperty<PartyID>, (gameState, partyId) =>
  mapByMapLocationIdSelector(gameState, mapLocationByPartyIdSelector(gameState, partyId).id),
);

export const activitiesSelector = (game: GameState) => game.activities;
export const activityByIdSelector = createSelector(
  activitiesSelector,
  selectorProperty<ActivityID>,
  (activities, activityID) => activities[activityID],
);

export const villageActivitiesSelector = createSelector(
  villageByIdSelector,
  activitiesSelector,
  (village, activities) => filter(x => x.targetId === village.id, values(activities)),
);

export const partyActivitySelector = createSelector(
  activitiesSelector,
  selectorProperty<UnitID>,
  (activitiesSelector, partyId) =>
    values(activitiesSelector).find(x => x.targetId === partyId || x.involvedTargetId === partyId),
);

export const noActiveActivityPartiesSelector = createSelector(
  playerPartiesSelector,
  activitiesSelector,
  (parties, activities) => {
    const activitiesArray = values(activities);
    return filter(
      (party: Party) =>
        !activitiesArray.some(activity => activity.targetId === party.id || activity.involvedTargetId === party.id),
      parties,
    );
  },
);

export const generalSelector = (game: GameState) => game.general;
