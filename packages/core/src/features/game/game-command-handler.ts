import { injectable } from "inversify";

import { commandHandler } from "@core";

import { GameService } from "./game-service";
import { GameCommand } from "./interfaces";

@injectable()
export class GameCommandHandler {
  constructor(private gameService: GameService) {}

  @commandHandler(GameCommand.TurnCommand)
  turn() {
    this.gameService.increaseTurn();
  }
}
