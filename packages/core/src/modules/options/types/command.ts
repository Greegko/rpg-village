import "@core/command";

import { ChooseOptionCommandArgs, OptionCommand } from "../interfaces";

declare module "@core/command" {
  interface CommandType {
    [OptionCommand.ChooseOption]: ChooseOptionCommandArgs;
  }
}
