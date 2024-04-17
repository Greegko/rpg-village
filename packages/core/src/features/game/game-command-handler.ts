import { injectable } from "inversify";

import { EventSystem, commandHandler } from "@core";

import { GameService } from "./game-service";
import { GameCommand, GameEvent } from "./interfaces";

@injectable()
export class GameCommandHandler {
  constructor(private gameService: GameService, private eventSystem: EventSystem) {}

  @commandHandler(GameCommand.TurnCommand)
  turn() {
    this.gameService.increaseTurn();
    this.eventSystem.fire(GameEvent.Turn);
  }
}
