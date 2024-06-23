import { VillageID } from "@features/village";

import { OptionID, OptionItemID } from "./options-store";

export enum OptionCommand {
  ChooseOption = "option/choose",
}

export interface ChooseOptionCommandArgs {
  villageId: VillageID;
  optionId: OptionID;
  optionItemId: OptionItemID;
}
