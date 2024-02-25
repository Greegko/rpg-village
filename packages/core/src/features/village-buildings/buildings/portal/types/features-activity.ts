import { GatherResourceFromPortalActivityStartArgs } from "../activities";
import { PortalActivity } from "../interface";

declare module "@features/activity" {
  export interface ActivityType {
    [PortalActivity.GatherResourceFromPortal]: GatherResourceFromPortalActivityStartArgs;
  }
}
