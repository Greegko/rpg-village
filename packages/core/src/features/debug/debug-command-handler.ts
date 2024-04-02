import { injectable } from "inversify";

import { commandHandler } from "@core";

import { VillageService } from "@features/village/village-service";

import { AddItemArgs, AddSoulArgs, DebugCommand, GenerateGoldArgs } from "./interfaces";

@injectable()
export class DebugCommandHandler {
  constructor(private villageService: VillageService) {}

  @commandHandler(DebugCommand.GenerateGold)
  generateGold(args: GenerateGoldArgs) {
    this.villageService.getStash(args.villageId).addResource({ gold: args.gold });
  }

  @commandHandler(DebugCommand.AddItem)
  addItem(args: AddItemArgs) {
    this.villageService.getStash(args.villageId).addItems([args.item]);
  }

  @commandHandler(DebugCommand.AddSoul)
  addSoul(args: AddSoulArgs) {
    this.villageService.getStash(args.villageId).addResource({ soul: args.soul });
  }
}
