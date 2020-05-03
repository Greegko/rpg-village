import '../polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { GameField } from './components';
import { GameInstanceWrapper } from './game/game-instance-wrapper';
import { gameReducer, gameUIReducer, updateGameState, gameMiscActionReducerFactory, } from './game/reducers';
import { createStore } from 'redux';
import { GameScreen, GameStoreState } from './game';
import { availableSkills } from './game/config/skills';

const game = new GameInstanceWrapper({
  available_skills: availableSkills
});

game.restoreOrNewGame();

const gameMiscActionReducer = gameMiscActionReducerFactory(game);
const reducers = (state: GameStoreState, action) => {
  gameMiscActionReducer(action);

  return {
    game: gameReducer(state.game, action),
    ui: gameUIReducer(state.ui, action),
  }
}

const store = createStore(reducers,
  { game: game.getState(), ui: { activeScreen: GameScreen.WorldMap, paused: false } },
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);

game.onStateUpdate(state => store.dispatch(updateGameState(state)));
game.resume();

ReactDOM.render(
  <Provider store={store}>
    <GameField />
  </Provider>,
  document.getElementById('game')
);