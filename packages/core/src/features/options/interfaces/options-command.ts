import { VillageID } from "@features/village";
import { ItemID } from "@models";

import { OptionID } from "./options-store";

export enum OptionCommand {
  ChooseOption = "option/choose",
}

export interface ChooseOptionCommandArgs {
  villageId: VillageID;
  optionId: OptionID;
  optionItemId: ItemID;
}
