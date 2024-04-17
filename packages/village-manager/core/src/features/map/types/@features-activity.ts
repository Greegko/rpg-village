import { MapActivityExploreStartArgs, MapActivityTravelStartArgs } from "../activites";
import { MapActivity } from "../interfaces";

declare module "@rpg-village/features/activity" {
  interface ActivityType {
    [MapActivity.Explore]: MapActivityExploreStartArgs;
    [MapActivity.Travel]: MapActivityTravelStartArgs;
  }
}
