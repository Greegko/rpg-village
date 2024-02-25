import { MapActivityExploreStartArgs, MapActivityTravelStartArgs } from "../activites";
import { MapActivity } from "../interfaces";

declare module "@features/activity" {
  export interface ActivityType {
    [MapActivity.Explore]: MapActivityExploreStartArgs;
    [MapActivity.Travel]: MapActivityTravelStartArgs;
  }
}
