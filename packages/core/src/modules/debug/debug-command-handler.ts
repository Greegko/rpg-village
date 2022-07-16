import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { VillageStashService } from "@modules/village";

import { DebugCommand, GenerateGoldArgs } from "./interfaces";

@injectable()
export class DebugCommandHandler {
  constructor(private villageStash: VillageStashService) {}

  @commandHandler(DebugCommand.GenerateGold)
  generateGold(args: GenerateGoldArgs) {
    this.villageStash.addResource({ gold: args.gold });
  }
}
