import { injectable } from "inversify";

import { ActivityManager, ActivityType } from "@modules/activity";
import { PartyStore } from "@modules/party";

import { PartyActivityStartArgs } from "./interfaces";

@injectable()
export class PartyActivityManager {
  constructor(private activityManager: ActivityManager, private partyStore: PartyStore) {}

  startPartyActivity<ActivityStartArgs extends PartyActivityStartArgs>(
    activityName: string,
    startingArgs: ActivityStartArgs,
  ) {
    if (this.partyStore.get(startingArgs.partyId).activityId) return;

    const activityHandler = this.activityManager.getActivityHandler(activityName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);
      const activity = this.activityManager.storeActivity({
        name: activityName,
        state: activityState,
        type: ActivityType.Party,
        startArgs: startingArgs,
      });

      this.partyStore.setActivity(startingArgs.partyId, activity.id);
      if (startingArgs.involvedPartyId) {
        this.partyStore.setActivity(startingArgs.involvedPartyId, activity.id);
      }
    }
  }
}
