import { DismantleRuneCommandArgs, EmpowerRuneCommandArgs, RuneWorkshopCommand } from "../rune-workshop-command";

declare module "@core" {
  interface CommandType {
    [RuneWorkshopCommand.CreateRune]: undefined;
    [RuneWorkshopCommand.ForgeDungeonKey]: undefined;
    [RuneWorkshopCommand.EmpowerRune]: EmpowerRuneCommandArgs;
    [RuneWorkshopCommand.DismantleRune]: DismantleRuneCommandArgs;
  }
}
