import { EntityStore, injectableStore } from "@rpg-village/core";

import { ActivityID, AnyActivity } from "./interfaces";

@injectableStore("activities", {})
export class ActivityStore extends EntityStore<ActivityID, AnyActivity> {}
