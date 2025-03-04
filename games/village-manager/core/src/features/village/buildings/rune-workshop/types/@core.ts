import {
  CreateRuneCommandArgs,
  DismantleRuneCommandArgs,
  EmpowerRuneCommandArgs,
  ForgeDungeonKeyCommandArgs,
  RuneWorkshopCommand,
} from "../rune-workshop-command";

declare module "@rpg-village/core/extend" {
  interface CommandType {
    [RuneWorkshopCommand.CreateRune]: CreateRuneCommandArgs;
    [RuneWorkshopCommand.ForgeDungeonKey]: ForgeDungeonKeyCommandArgs;
    [RuneWorkshopCommand.EmpowerRune]: EmpowerRuneCommandArgs;
    [RuneWorkshopCommand.DismantleRune]: DismantleRuneCommandArgs;
  }
}
