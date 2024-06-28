import { forEach, times } from "remeda";
import { createComputed, createSignal, onCleanup } from "solid-js";

import { GameState, createGameInstance } from "@rpg-village/bannerlords-core";

import { createAiHandler } from "./ai/main";

const gameInstance = createGameInstance();
gameInstance.startNewGame();

const [turnTimerHandler, setTurnTimerHandler] = createSignal<number>();
const [gameSpeed, setGameSpeed] = createSignal<number>(0);
const [gameState, setGameState] = createSignal<GameState>(gameInstance.getState());
const { executeAI } = createAiHandler(gameState());

const turnHandler = () => {
  setGameState(gameInstance.gameTurn());
  const commands = executeAI(gameState());
  forEach(commands, command => gameInstance.executeCommand(command));
};
const run = () => gameSpeed() > 0;

console.log(gameState());

const fastForward = (turns: number) => times(turns, turnHandler);

createComputed(() => {
  if (gameSpeed() > 0) {
    setTurnTimerHandler(window.setInterval(turnHandler, 1000 / gameSpeed()));
  }

  onCleanup(() => clearInterval(turnTimerHandler()));
});

export { gameState, run, gameSpeed, setGameSpeed, fastForward };
