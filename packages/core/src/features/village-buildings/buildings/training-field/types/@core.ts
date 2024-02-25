import { TrainingFieldCommand, TrainingFieldCommandArgs } from "../training-field-command";

declare module "@core" {
  interface CommandType {
    [TrainingFieldCommand.Train]: TrainingFieldCommandArgs;
  }
}
