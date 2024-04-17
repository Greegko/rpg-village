import { EntityStore } from "@rpg-village/core";

import { ActivityID, AnyActivity } from "./interfaces";

export class ActivityStore extends EntityStore<ActivityID, AnyActivity> {}
