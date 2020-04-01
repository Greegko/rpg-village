import { EntityStore } from "../../lib/entity-store";
import { ActivityID, AnyActivity } from "./interfaces";

export class ActivityStore extends EntityStore<AnyActivity, ActivityID> { };
