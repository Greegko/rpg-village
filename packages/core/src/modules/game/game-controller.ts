import { injectable } from "inversify";

import { Command, CommandSystem } from "@core/command";
import { EventSystem } from "@core/event";

import { GameStore } from "./game-store";
import { GameCommand, GameState } from "./interfaces";

@injectable()
export class GameController<State extends GameState> {
  constructor(private gameStore: GameStore<State>, private commandSystem: CommandSystem, eventSystem: EventSystem) {
    commandSystem.hookCommandHandlers();
    eventSystem.hookEventHandlers();
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

  executeCommand(command: Command): State {
    if ("args" in command) {
      this.commandSystem.execute(command.command, command.args);
    } else {
      this.commandSystem.execute(command.command);
    }

    return this.gameStore.getState();
  }
}
