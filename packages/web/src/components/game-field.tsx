import { memo } from "react";

import { useGameStateSelector } from "@web/store/game";

import { Dashboard } from "./dashboard";
import { WorldMap } from "./world-map/world-map";

import "./game-field.scss";

export const GameField = () => {
  const gameState = useGameStateSelector(x => x);

  if (!gameState) return null;

  return <GameFieldScreen />;
};

const GameFieldScreen = memo(() => (
  <>
    <Dashboard />
    <WorldMap />
  </>
));
