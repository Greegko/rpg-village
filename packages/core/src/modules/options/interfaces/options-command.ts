import { ItemID } from "@models";

import { OptionID } from "./options-store";

export enum OptionCommand {
  ChooseOption = "option/choose",
}

export interface ChooseOptionCommandArgs {
  optionId: OptionID;
  optionItemId: ItemID;
}
