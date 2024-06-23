import { TrainingFieldCommand, TrainingFieldCommandArgs } from "../training-field-command";

declare module "@rpg-village/core" {
  interface CommandType {
    [TrainingFieldCommand.Train]: TrainingFieldCommandArgs;
  }
}
