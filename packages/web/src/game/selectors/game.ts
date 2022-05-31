import { createSelector } from "reselect";
import { values, filter, groupBy, propEq } from "ramda";
import { isHero, ActivityType, GameState, PartyOwner, Activity, Party, WorldMapID } from "@rpg-village/core";

export const mapSelector = (game: GameState) => game.map;
export const mapLocationsSelector = createSelector(mapSelector, values);

export const worldMapSelector = createSelector(mapLocationsSelector, filter(propEq("mapId", WorldMapID)));

export const unitsSelector = (game: GameState) => game.units;
export const heroUnitsSelector = createSelector(unitsSelector, filter(isHero));

export const villageSelector = (game: GameState) => game.village;

export const partiesSelector = (game: GameState) => game.parties;
export const playerPartiesSelector = createSelector(partiesSelector, parties =>
  filter(party => party.owner === PartyOwner.Player, parties),
);
export const partiesGroupedOnLocationsSelector = createSelector(partiesSelector, parties =>
  groupBy(party => party.locationId, values(parties)),
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
