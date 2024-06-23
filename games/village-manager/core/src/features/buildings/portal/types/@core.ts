import { PortalCommand, PortalCommandEnterPortalArgs } from "../interface";

declare module "@rpg-village/core" {
  interface CommandType {
    [PortalCommand.EnterPortal]: PortalCommandEnterPortalArgs;
  }
}
