import { EntityStore } from "../../../core-src";
import { ActivityID, AnyActivity } from "./interfaces";

export class ActivityStore extends EntityStore<AnyActivity, ActivityID> { };
