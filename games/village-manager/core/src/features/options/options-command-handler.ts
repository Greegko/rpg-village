import { inject, injectable } from "@rpg-village/core";
import { commandHandler } from "@rpg-village/core";

import { VillageService } from "@features/village";

import { ChooseOptionCommandArgs, OptionCommand } from "./interfaces";
import { OptionStore } from "./options-store";

@injectable()
export class OptionCommandHandler {
  private villageService = inject(VillageService);
  private optionStore = inject(OptionStore);

  @commandHandler(OptionCommand.ChooseOption)
  chooseOption(args: ChooseOptionCommandArgs) {
    const item = this.optionStore.get(args.optionId).items.find(x => x.id === args.optionItemId);

    if (!item) return;

    this.optionStore.remove(args.optionId);
    this.villageService.getStash(args.villageId).addItems([item.item]);
  }
}
