import {
  PortalCommand,
  PortalCommandEnterPortalArgs,
  PortalCommandLeavePortalArgs,
  PortalCommandOpenPortalArgs,
} from "../portal-command";

declare module "@core" {
  interface CommandType {
    [PortalCommand.OpenPortal]: PortalCommandOpenPortalArgs;
    [PortalCommand.EnterPortal]: PortalCommandEnterPortalArgs;
    [PortalCommand.LeavePortal]: PortalCommandLeavePortalArgs;
  }
}
