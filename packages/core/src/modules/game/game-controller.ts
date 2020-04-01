import { inject, multiInject, injectable } from 'inversify';
import { GameState } from './interfaces';
import { GameStore } from './game-store';
import { Command, CommandHandler, EventHandler } from "../../models";
import { CommandSystem } from "../../lib/command-system";
import { GameCommand } from './interfaces';
import { EventSystem } from '../../lib/event-system';

@injectable()
export class GameController<State extends GameState> {
  constructor(
    @inject('GameStore') private gameStore: GameStore<State>,
    @inject('CommandSystem') private commandSystem: CommandSystem,
    @inject('EventSystem') eventSystem: EventSystem,
    @multiInject('commandHandlers') commandHandlers: CommandHandler[],
    @multiInject('eventHandlers') eventHandlers: EventHandler[],
  ) {
    commandSystem.hookCommandHandlers(commandHandlers);
    eventSystem.hookEventHandlers(eventHandlers);
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
