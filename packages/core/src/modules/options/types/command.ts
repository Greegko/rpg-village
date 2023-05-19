import { ChooseOptionCommandArgs, OptionCommand } from "../interfaces";

declare module "@core" {
  export interface CommandType {
    [OptionCommand.ChooseOption]: ChooseOptionCommandArgs;
  }
}
