import { GameState, createGameInstance } from './dist/src';
import * as modules from './dist/src';

const game = createGameInstance<GameState>({
  modules: [
    modules.gameModule, modules.configModule, modules.playerModule, modules.worldModule, modules.villageModule, modules.buildingsModule,
    modules.heroModule, modules.partyModule, modules.stashModule, modules.battleModule, modules.skillModule
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
