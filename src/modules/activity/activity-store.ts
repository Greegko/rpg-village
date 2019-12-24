import { EntityStore } from "@greegko/rpg-model";
import { ActivityID, AnyActivity } from "./interfaces";

export class ActivityStore extends EntityStore<AnyActivity, ActivityID> { };
