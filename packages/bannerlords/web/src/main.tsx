import "reflect-metadata";
import { render } from "solid-js/web";

import { fastForward, gameSpeed, gameState, run, setGameSpeed } from "./game";
import "./main.css";
import { Map } from "./map";

const Control = () => {
  return (
    <div>
      Turn: {gameState().general.turn}
      State: {run() ? "Running" : "Paused"} -{" "}
      <button onClick={() => setGameSpeed(gameSpeed => +!gameSpeed)}>Switch</button>
      GameSpeed: {gameSpeed()} <button onClick={() => setGameSpeed(speed => (speed + 1) % 4)}>Switch</button>
      Fast Forward: <button onClick={[fastForward, 10]}>10</button> <button onClick={[fastForward, 100]}>100</button>{" "}
      <button onClick={[fastForward, 1000]}>1000</button>
      <button onClick={() => console.log(gameState())}>Log GameState</button>
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
