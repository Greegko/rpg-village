import { render } from "solid-js/web";

import { ProgressBar } from "./components/progress-bar";
import { fastForward, gameSpeed, gameState, run, setGameSpeed } from "./game";
import "./main.css";
import { Map } from "./map";

const Control = () => {
  return (
    <div>
      Turn: {gameState().general.turn}
      <ProgressBar max={24} value={gameState().general.turn} />
      State: {run() ? "Running" : "Paused"} -{" "}
      <button class="px-3 mr-2 bg-gray-300 rounded-full" onClick={() => setGameSpeed(gameSpeed => +!gameSpeed)}>
        Switch
      </button>
      GameSpeed: {gameSpeed()}{" "}
      <button class="px-3 mr-2 bg-gray-300 rounded-full" onClick={() => setGameSpeed(speed => (speed + 1) % 4)}>
        Switch
      </button>
      Fast Forward:{" "}
      <button class="px-3 mr-2 bg-gray-300 rounded-full" onClick={[fastForward, 1]}>
        Step
      </button>
      <button class="px-3 mr-2 bg-gray-300 rounded-full" onClick={[fastForward, 10]}>
        10
      </button>{" "}
      <button class="px-3 mr-2 bg-gray-300 rounded-full" onClick={[fastForward, 100]}>
        100
      </button>{" "}
      <button class="px-3 mr-2 bg-gray-300 rounded-full" onClick={[fastForward, 1000]}>
        1000
      </button>
      <button class="px-3 mr-2 bg-gray-300 rounded-full" onClick={() => console.log(gameState())}>
        Log GameState
      </button>
    </div>
  );
};

const App = () => (
  <div>
    Bannerlords
    <Control />
    <Map />
  </div>
);

render(() => <App />, document.getElementById("game")!);
