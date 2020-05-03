import { EntityStore } from "../../lib/entity-store";
import { ActivityID, PartyActivity } from "./interfaces";

export class ActivityStore extends EntityStore<PartyActivity, ActivityID> { };
