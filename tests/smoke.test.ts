import { GameState, createGameInstance } from '../src';
import * as modules from '../src';

const game = createGameInstance<GameState>({
  modules: [
    modules.gameModule, modules.configModule, modules.playerModule, modules.worldModule, modules.villageModule, modules.buildingsModule,
    modules.partyModule, modules.battleModule, modules.skillModule
  ]
});

game.startNewGame();

const newState = game.gameTurn();

if (newState.general.turn !== 1) {
  console.log('Turn does not match!');
  console.log(newState);
} else {
  console.log('Integration is fine!');
}
