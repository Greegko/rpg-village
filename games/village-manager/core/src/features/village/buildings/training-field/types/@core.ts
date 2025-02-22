import { TrainingFieldCommand, TrainingFieldCommandArgs } from "../training-field-command";

declare module "@rpg-village/core/extend" {
  interface CommandType {
    [TrainingFieldCommand.Train]: TrainingFieldCommandArgs;
  }
}
