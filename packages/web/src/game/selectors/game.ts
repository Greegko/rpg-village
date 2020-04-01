import { GameStoreState } from "../interface";
import { createSelector } from 'reselect';
import { values, filter, pipe, groupBy } from 'ramda';
import { isHero } from "@rpg-village/core";

export const gameSelector = (state: GameStoreState) => state.game;
export const worldSelector = createSelector(gameSelector, game => game.world);
export const worldLocationsSelector = createSelector(worldSelector, values);
export const unitsSelector = createSelector(gameSelector, game => game.units);
export const heroUnitsSelector = createSelector(unitsSelector, pipe(values, filter(isHero)));
export const villageSelector = createSelector(gameSelector, game => game.village);
export const partiesSelector = createSelector(gameSelector, game => game.parties);
export const partiesGroupedOnLocationsSelector = createSelector(partiesSelector, parties => groupBy(party => party.locationId, values(parties)));
