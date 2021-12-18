import { injectable } from "inversify";
import { commandHandler } from "@core/command";
import { ActivityManager } from "@modules/activity";
import { GameCommand } from "./interfaces";
import { GameService } from "./game-service";

@injectable()
export class GameCommandHandler {
  constructor(private gameService: GameService, private activityManager: ActivityManager) {}

  @commandHandler(GameCommand.TurnCommand)
  turn() {
    this.gameService.increaseTurn();
    this.activityManager.runActivites();
  }
}
