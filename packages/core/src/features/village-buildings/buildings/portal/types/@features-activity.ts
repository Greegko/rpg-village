import { GatherResourceFromPortalActivityStartArgs } from "../activities";
import { PortalActivity } from "../interface";

declare module "@features/activity" {
  interface ActivityType {
    [PortalActivity.GatherResourceFromPortal]: GatherResourceFromPortalActivityStartArgs;
  }
}
