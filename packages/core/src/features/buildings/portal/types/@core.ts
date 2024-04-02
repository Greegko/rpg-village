import { PortalCommand, PortalCommandEnterPortalArgs } from "../interface";

declare module "@core" {
  interface CommandType {
    [PortalCommand.EnterPortal]: PortalCommandEnterPortalArgs;
  }
}
