import { EntityStore } from "@core";

import { ActivityID, AnyActivity } from "./interfaces";

export class ActivityStore extends EntityStore<ActivityID, AnyActivity> {}
