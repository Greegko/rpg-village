import { injectable } from "inversify";

import { Command, CommandSystem, Event, EventSystem, GameState } from "@core";

import { GameCommand, GameStore } from "@features/game";

@injectable()
export class GameController {
  constructor(private gameStore: GameStore, private commandSystem: CommandSystem, private eventSystem: EventSystem) {
    commandSystem.hookCommandHandlers();
    eventSystem.hookEventHandlers();
  }

  gameTurn() {
    this.commandSystem.execute(GameCommand.TurnCommand);
    return this.gameStore.getState();
  }

  loadGame(gameState: GameState): GameState {
    this.gameStore.init(gameState);
    return this.gameStore.getState();
  }

  getState(): GameState {
    return this.gameStore.getState();
  }

  startNewGame(): GameState {
    this.gameStore.init({} as any);
    this.commandSystem.execute(GameCommand.NewGame);
    return this.gameStore.getState();
  }

  /**
   * Interface to test events
   * @internal
   */
  emitEvent(event: Event) {
    // @ts-ignore
    this.eventSystem.fire(event.event, event.args);
  }

  executeCommand(command: Command): GameState {
    if ("args" in command) {
      // @ts-ignore
      this.commandSystem.execute(command.command, command.args);
    } else {
      this.commandSystem.execute(command.command);
    }

    return this.gameStore.getState();
  }
}
