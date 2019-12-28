import { GameState, createGameInstance } from '../src';
import * as modules from '../src';

export function gameFactory() {
  return createGameInstance<GameState>({
    modules: [
      modules.gameModule, modules.configModule, modules.playerModule, modules.worldModule, modules.villageModule, modules.buildingsModule,
      modules.partyModule, modules.battleModule, modules.skillModule
    ]
  });
}
