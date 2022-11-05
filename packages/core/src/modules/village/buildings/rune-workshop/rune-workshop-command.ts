export enum RuneWorkshopCommand {
  CreateRune = "rune-workshop/create-rune",
  ForgeDungeonKey = "rune-workshop/forge-dungeon-key",
}

declare module "@core/global-type/command-type" {
  interface CommandType {
    [RuneWorkshopCommand.CreateRune]: undefined;
    [RuneWorkshopCommand.ForgeDungeonKey]: undefined;
  }
}
