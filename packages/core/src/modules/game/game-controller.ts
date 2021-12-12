import { multiInject, injectable } from "inversify";
import { EventHandler, EventSystem } from "@core/event";
import { Command, CommandHandler, CommandSystem } from "@core/command";

import { GameState, GameCommand } from "./interfaces";
import { GameStore } from "./game-store";

@injectable()
export class GameController<State extends GameState> {
  constructor(
    private gameStore: GameStore<State>,
    private commandSystem: CommandSystem,
    eventSystem: EventSystem,
    @multiInject("commandHandlers") commandHandlers: CommandHandler[],
    @multiInject("eventHandlers") eventHandlers: EventHandler[],
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
