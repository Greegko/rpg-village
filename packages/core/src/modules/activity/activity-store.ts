import { EntityStore } from "@core/store";
import { ActivityID, PartyActivity } from "./interfaces";

export class ActivityStore extends EntityStore<PartyActivity, ActivityID> { };
