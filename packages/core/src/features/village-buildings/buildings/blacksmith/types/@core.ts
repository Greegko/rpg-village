import {
  BlacksmithCommand,
  BlacksmithCommandCreateItemArgs,
  BlacksmithCommandUpgradeItemArgs,
} from "../blacksmith-command";

declare module "@core" {
  interface CommandType {
    [BlacksmithCommand.UpgradeItem]: BlacksmithCommandUpgradeItemArgs;
    [BlacksmithCommand.CreateItem]: BlacksmithCommandCreateItemArgs;
  }
}
