import { forEach, times } from "remeda";
import { batch, createComputed, createSignal, onCleanup } from "solid-js";

import { GameState, createGameInstance } from "@rpg-village/bannerlords";

import { executeAI } from "./ai/main";

const gameInstance = createGameInstance();
gameInstance.startNewGame();

const [turnTimerHandler, setTurnTimerHandler] = createSignal<number>();
const [gameSpeed, setGameSpeed] = createSignal<number>(0);
const [gameState, setGameState] = createSignal<GameState>(gameInstance.getState());
const turnHandler = () => {
  setGameState(gameInstance.gameTurn());
  const commands = executeAI(gameState());
  forEach(commands, command => gameInstance.executeCommand(command));
};
const run = () => gameSpeed() > 0;


const fastForward = (turns: number) => batch(() => times(turns, turnHandler));

createComputed(() => {
  if (gameSpeed() > 0) {
    setTurnTimerHandler(window.setInterval(turnHandler, 1000 / gameSpeed()));
  }

  onCleanup(() => clearInterval(turnTimerHandler()));
});

export { gameState, run, gameSpeed, setGameSpeed, fastForward };
