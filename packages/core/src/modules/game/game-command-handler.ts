import { injectable } from "inversify";
import { CommandSystem } from "@core/command";
import { ActivityManager } from "@modules/activity";
import { GameCommand } from "./interfaces";
import { GameService } from "./game-service";

@injectable()
export class GameCommandHandler {
  constructor(private gameService: GameService, private activityManager: ActivityManager) {}

  init(commandSystem: CommandSystem) {
    commandSystem.on(GameCommand.TurnCommand, () => this.turn());
  }

  private turn() {
    this.gameService.increaseTurn();
    this.activityManager.runActivites();
  }
}
