import { ChooseOptionCommandArgs, OptionCommand } from "../interfaces";
import { OptionID, OptionState } from "../interfaces";

declare module "@core" {
  interface CommandType {
    [OptionCommand.ChooseOption]: ChooseOptionCommandArgs;
  }

  interface GameState {
    options: Record<OptionID, OptionState>;
  }
}
