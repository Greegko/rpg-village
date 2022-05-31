import { keys } from "ramda";
import { connect } from "react-redux";

import { Party, VillageState } from "@rpg-village/core";

import { GameStoreState, playerPartiesSelector, villageSelector } from "../game";
import { Dashboard } from "./dashboard";
import { WorldMap } from "./map-map/map-map";

import "./game-field.scss";

function propertyMapper(state: GameStoreState) {
  return {
    parties: playerPartiesSelector(state.game),
    village: villageSelector(state.game),
  };
}

interface GameFieldState {
  parties: Record<string, Party>;
  village: VillageState;
}

export const GameField = connect(propertyMapper)(({ parties, village }: GameFieldState) => (
  <>
    <Dashboard parties={keys(parties)} village={village} />
    <WorldMap />
  </>
));
