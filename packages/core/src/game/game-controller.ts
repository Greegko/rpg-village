import { Command, CommandSystem, Event, EventSystem } from "@core";
import { inject, injectable } from "@lib/dependency-injection";

import { GameState } from "@rpg-village/core/extend";

import { GameStore } from "./game-store";
import { GameCommand } from "./interfaces";

@injectable()
export class GameController {
  private gameStore = inject(GameStore);
  private commandSystem = inject(CommandSystem);
  private eventSystem = inject(EventSystem);

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
