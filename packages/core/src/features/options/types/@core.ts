import { ChooseOptionCommandArgs, OptionCommand, OptionID, OptionState } from "../interfaces";

declare module "@core" {
  interface CommandType {
    [OptionCommand.ChooseOption]: ChooseOptionCommandArgs;
  }

  interface GameState {
    options: Record<OptionID, OptionState>;
  }
}
