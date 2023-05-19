import { ItemID } from "@models/item";

import { OptionID } from "./options-store";

export enum OptionCommand {
  ChooseOption = "option/choose",
}

export interface ChooseOptionCommandArgs {
  optionId: OptionID;
  optionItemId: ItemID;
}

declare module "@core/command" {
  interface CommandType {
    [OptionCommand.ChooseOption]: ChooseOptionCommandArgs;
  }
}
