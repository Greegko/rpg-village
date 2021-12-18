import "../polyfill";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { GameField } from "./components/game-field";
import { GameInstanceWrapper } from "./game/game-instance-wrapper";
import { gameReducer, gameUIReducer, updateGameState, gameMiscActionReducerFactory } from "./game/reducers";
import { createStore } from "redux";
import { GameStoreState } from "./game";
import { PlayerAI } from "./ai/player-ai";

const game = new GameInstanceWrapper();

const playerAI = new PlayerAI();

game.restoreOrNewGame();
game.setAI(playerAI.execute);

const gameMiscActionReducer = gameMiscActionReducerFactory(game);
const reducers = (state: GameStoreState = {} as any, action: any) => {
  gameMiscActionReducer(action);

  return {
    game: gameReducer(state.game, action),
    ui: gameUIReducer(state.ui, action),
  };
};

const store = createStore(
  reducers,
  { game: game.getState(), ui: { paused: false, ai: true } },
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);

game.onStateUpdate(state => store.dispatch(updateGameState(state)));
game.resume();

render(
  <Provider store={store}>
    <GameField />
  </Provider>,
  document.getElementById("game"),
);
