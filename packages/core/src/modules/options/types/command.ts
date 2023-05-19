import "@core/command";

import { ChooseOptionCommandArgs, OptionCommand } from "../interfaces";

declare module "@core/command" {
  export interface CommandType {
    [OptionCommand.ChooseOption]: ChooseOptionCommandArgs;
  }
}
