import { gameFactory } from "./game-factory";
import test from "ava";

test("should pass the turn", t => {
  const game = gameFactory();

  game.startNewGame();

  const newState = game.gameTurn();

  t.is(newState.general.turn, 1);
});
