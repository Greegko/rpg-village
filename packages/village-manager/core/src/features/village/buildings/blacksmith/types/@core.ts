import {
  BlacksmithCommand,
  BlacksmithCommandCreateItemArgs,
  BlacksmithCommandUpgradeItemArgs,
} from "../blacksmith-command";

declare module "@rpg-village/core" {
  interface CommandType {
    [BlacksmithCommand.UpgradeItem]: BlacksmithCommandUpgradeItemArgs;
    [BlacksmithCommand.CreateItem]: BlacksmithCommandCreateItemArgs;
  }
}
