import { BlacksmithCommand, BlacksmithCommandCreateItemArgs, BlacksmithCommandUpgradeItemArgs } from "../blacksmith-command";

declare module "@rpg-village/core/extend" {
  interface CommandType {
    [BlacksmithCommand.UpgradeItem]: BlacksmithCommandUpgradeItemArgs;
    [BlacksmithCommand.CreateItem]: BlacksmithCommandCreateItemArgs;
  }
}
