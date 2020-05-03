import { createSelector } from 'reselect';
import { values, filter, pipe, groupBy, none } from 'ramda';
import { isHero, ActivityType, PartyActivity, GameState } from "@rpg-village/core";

export const worldSelector = (game: GameState) => game.world;
export const worldLocationsSelector = createSelector(worldSelector, values);

export const unitsSelector = (game: GameState) => game.units;
export const heroUnitsSelector = createSelector(unitsSelector, pipe(filter(isHero), values));

export const villageSelector = (game: GameState) => game.village;

export const partiesSelector = (game: GameState) => game.parties;
export const partiesGroupedOnLocationsSelector = createSelector(partiesSelector, parties => groupBy(party => party.locationId, values(parties)));

export const activitiesSelector = (game: GameState) => game.activities;
export const partyActivitiesSelector = createSelector(activitiesSelector, filter(activity => activity.type === ActivityType.Party));

export const idlePartiesSelector = createSelector(
  partiesSelector,
  partyActivitiesSelector,
  (parties, partiesActivities: Record<string, PartyActivity>) => {
    return filter(party => none(partiesActivity => partiesActivity.state.partyId === party.id, values(partiesActivities)), parties);
  }
);
