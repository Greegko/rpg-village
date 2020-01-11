import { injectable, inject } from "inversify";
import { CommandHandler } from "../../models";
import { CommandSystem } from "../../lib/command-system";
import { WorldCommand, WorldActivity } from "./interfaces";
import { ActivityManager } from "../activity";


@injectable()
export class WorldCommandHandler implements CommandHandler {
  constructor(
    @inject('ActivityManager') private activityManager: ActivityManager
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(WorldCommand.Travel, (args: any) => this.travelCommand(args));
    commandSystem.on(WorldCommand.Explore, (args: any) => this.exploreCommand(args));
  }

  private travelCommand(travelArgs: any) {
    this.activityManager.startActivity(WorldActivity.Travel, travelArgs);
  }

  private exploreCommand(exploreArgs: any) {
    this.activityManager.startActivity(WorldActivity.Explore, exploreArgs);
  }
}
