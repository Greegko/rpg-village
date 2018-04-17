import { createGameInstance, GameState } from '@greegko/rpg-model';
import { villageModule, worldModule, battleModule } from './dist'; 

const game = createGameInstance<GameState>({
  modules: [worldModule, villageModule, battleModule]
});

const newState = game.gameTurn();

if(newState.general.turn !== 1) {
  console.log('Turn does not match!');
  console.log(newState);
} else {
  console.log('Integration is fine!');
}
