import { inject, multiInject, injectable } from 'inversify';
import { GameState } from './interfaces';
import { GameStore } from './game-store';
import { Command, CommandHandler } from "../../models";
import { CommandSystem } from "../../lib/command-system";
import { GameCommand } from './interfaces';

@injectable()
export class GameController<State extends GameState> {
  constructor(
    @inject('GameStore') private gameStore: GameStore<State>,
    @inject('CommandSystem') private commandSystem: CommandSystem,
    @multiInject('commandHandlers') commandHandlers: CommandHandler[]
  ) {
    commandSystem.hookCommandHandlers(commandHandlers);
  }

  gameTurn() {
    this.commandSystem.execute(GameCommand.TurnCommand);
    return this.gameStore.getState();
  }

  loadGame(gameState: State): State {
    this.gameStore.init(gameState);
    return this.gameStore.getState();
  }

  getState(): State {
    return this.gameStore.getState();
  }

  startNewGame(): State {
    this.gameStore.init({} as any);
    this.commandSystem.execute(GameCommand.NewGame);
    return this.gameStore.getState();
  }

  executeCommand({ command, args }: Command): State {
    this.commandSystem.execute(command, args);

    return this.gameStore.getState();
  }
}
