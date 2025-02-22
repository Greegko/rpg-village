import { ChooseOptionCommandArgs, OptionCommand, OptionID, OptionState } from "../interfaces";

declare module "@rpg-village/core/extend" {
  interface CommandType {
    [OptionCommand.ChooseOption]: ChooseOptionCommandArgs;
  }

  interface GameState {
    options: Record<OptionID, OptionState>;
  }
}
