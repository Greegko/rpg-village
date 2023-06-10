import { EntityStore } from "@core";

import { Activity, ActivityID } from "./interfaces";

export class ActivityStore extends EntityStore<ActivityID, Activity> {}
