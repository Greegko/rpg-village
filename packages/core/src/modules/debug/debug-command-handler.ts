import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { VillageStashService } from "@modules/village";

import { AddItemArgs, DebugCommand, GenerateGoldArgs } from "./interfaces";

@injectable()
export class DebugCommandHandler {
  constructor(private villageStash: VillageStashService) {}

  @commandHandler(DebugCommand.GenerateGold)
  generateGold(args: GenerateGoldArgs) {
    this.villageStash.addResource({ gold: args.gold });
  }

  @commandHandler(DebugCommand.AddItem)
  addItem(args: AddItemArgs) {
    this.villageStash.addItems([args.item]);
  }
}
