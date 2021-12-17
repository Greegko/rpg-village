import { forEach, values, assoc } from "ramda";
import { inject, injectable } from "inversify";
import { PartyStore } from "@modules/party";
import { GetActivityHandlerByName, PartyActivity, ActivityType, PartyActivityStartArgs } from "./interfaces";
import { ActivityStore } from "./activity-store";

@injectable()
export class ActivityManager {
  constructor(
    @inject("getActivityHandler") private getActivityHandler: GetActivityHandlerByName,
    private activityStore: ActivityStore,
    private partyStore: PartyStore,
  ) {}

  startPartyActivity(activtyName: string, startingArgs: PartyActivityStartArgs) {
    if (this.partyStore.get(startingArgs.partyId).activityId) return;

    const activityHandler = this.getActivityHandler(activtyName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);
      const activity = this.activityStore.add({
        name: activtyName,
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

  runActivites() {
    forEach(activity => this.executeActivity(activity), values(this.activityStore.getState()));
  }

  private executeActivity(activity: PartyActivity) {
    const activityHandler = this.getActivityHandler(activity.name);
    const activityNewState = activityHandler.execute(activity);
    const updatedActivity = assoc("state", activityNewState, activity);
    const isDone = activityHandler.isDone(updatedActivity);

    if (isDone) {
      activityHandler.resolve(updatedActivity);
      this.activityStore.remove(activity.id);
      this.partyStore.setActivity(activity.startArgs.partyId, undefined);
      if (activity.startArgs.involvedPartyId) {
        this.partyStore.setActivity(activity.startArgs.involvedPartyId, undefined);
      }
    } else {
      this.activityStore.update(activity.id, updatedActivity);
    }
  }
}
