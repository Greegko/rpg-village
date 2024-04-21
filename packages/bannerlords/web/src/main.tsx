import "reflect-metadata";
import { createComputed, createSignal, onCleanup } from "solid-js";
import { render } from "solid-js/web";

import { GameState, createGameInstance } from "@rpg-village/bannerlords";

import "./main.css";

const gameInstance = createGameInstance();

gameInstance.startNewGame();

const Control = () => {
  const [run, setRun] = createSignal<boolean>();
  const [turnTimerHandler, setTurnTimerHandler] = createSignal<number>();
  const [gameSpeed, setGameSpeed] = createSignal<number>(0);

  const [gameState, setGameState] = createSignal<GameState>(gameInstance.getState());

  const turnHandler = () => {
    setGameState(gameInstance.gameTurn());
  };

  createComputed(() => {
    if (run()) {
      turnHandler();
      setGameSpeed(1);
    } else {
      setGameSpeed(0);
    }
  });

  createComputed(() => {
    if (gameSpeed() > 0) {
      setTurnTimerHandler(window.setInterval(turnHandler, 1000 / gameSpeed()));
    }

    onCleanup(() => clearInterval(turnTimerHandler()));
  });

  return (
    <div>
      Turn: {gameState().general.turn}
      State: {run() ? "Running" : "Paused"} - <button onClick={() => setRun(run => !run)}>Switch</button>
      GameSpeed: {gameSpeed()} <button onClick={() => setGameSpeed(speed => (speed + 1) % 4)}>Swtich</button>
    </div>
  );
};

const App = () => (
  <div>
    Bannerlords
    <Control />
  </div>
);

render(() => <App />, document.getElementById("game")!);
