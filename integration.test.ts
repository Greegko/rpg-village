import { createGameInstance, GameState } from '@greegko/rpg-model';
import { villageModule, worldModule, battleModule, skillModule, stashModule, partyModule } from './dist'; 

const game = createGameInstance<GameState>({
  modules: [worldModule, villageModule, skillModule, battleModule, partyModule, stashModule]
});

const newState = game.gameTurn();

if(newState.general.turn !== 1) {
  console.log('Turn does not match!');
  console.log(newState);
} else {
  console.log('Integration is fine!');
}
