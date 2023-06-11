import { injectable } from "inversify";

import { commandHandler } from "@core";

import { VillageStashService } from "@features/village";

import { ChooseOptionCommandArgs, OptionCommand } from "./interfaces";
import { OptionStore } from "./options-store";

@injectable()
export class OptionCommandHandler {
  constructor(private villageStashService: VillageStashService, private optionStore: OptionStore) {}

  @commandHandler(OptionCommand.ChooseOption)
  chooseOption(args: ChooseOptionCommandArgs) {
    const item = this.optionStore.get(args.optionId).items.find(x => x.id === args.optionItemId);

    if (!item) return;

    this.optionStore.remove(args.optionId);

    this.villageStashService.addItems([item.item]);
  }
}
