import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { ActivityManager } from "@modules/activity";

import { GameService } from "./game-service";
import { GameCommand } from "./interfaces";

@injectable()
export class GameCommandHandler {
  constructor(private gameService: GameService, private activityManager: ActivityManager) {}

  @commandHandler(GameCommand.TurnCommand)
  turn() {
    this.gameService.increaseTurn();
    this.activityManager.runActivites();
  }
}
