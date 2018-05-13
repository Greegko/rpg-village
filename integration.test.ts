import { GameState, createGameInstance } from '@greegko/rpg-model';
import { battleModule, buildingsModule, configModule, heroModule, partyModule, playerModule, skillModule, stashModule, villageModule, worldModule } from './dist';

const game = createGameInstance<GameState>({
  modules: [
    configModule, playerModule, worldModule, villageModule, buildingsModule,
    heroModule, partyModule, stashModule, battleModule, skillModule
  ]
});

const newState = game.gameTurn();

if(newState.general.turn !== 1) {
  console.log('Turn does not match!');
  console.log(newState);
} else {
  console.log('Integration is fine!');
}
