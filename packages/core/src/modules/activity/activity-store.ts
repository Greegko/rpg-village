import { EntityStore } from "@core/store";

import { ActivityID, Activity } from "./interfaces";

export class ActivityStore extends EntityStore<ActivityID, Activity> {}
