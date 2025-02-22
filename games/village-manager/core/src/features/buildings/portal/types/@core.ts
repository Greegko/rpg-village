import { PortalCommand, PortalCommandEnterPortalArgs } from "../interface";

declare module "@rpg-village/core/extend" {
  interface CommandType {
    [PortalCommand.EnterPortal]: PortalCommandEnterPortalArgs;
  }
}
