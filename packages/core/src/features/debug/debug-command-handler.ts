import { injectable } from "inversify";

import { commandHandler } from "@core";

import { VillageStashService } from "@features/village";

import { AddItemArgs, AddSoulArgs, DebugCommand, GenerateGoldArgs } from "./interfaces";

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

  @commandHandler(DebugCommand.AddSoul)
  addSoul(args: AddSoulArgs) {
    this.villageStash.addResource({ soul: args.soul });
  }
}
