import { inject, injectable } from 'inversify';
import { forEach, values, assoc } from 'ramda';
import { GetActivityHandlerByName, PartyActivity, ActivityType, PartyActivityStartArgs } from './interfaces';
import { ActivityStore } from './activity-store';
import { PartyService } from '../party';

@injectable()
export class ActivityManager {

  constructor(
    @inject('getActivityHandler') private getActivityHandler: GetActivityHandlerByName,
    @inject('ActivityStore') private activityStore: ActivityStore,
    @inject('PartyService') private partyService: PartyService
  ) { }

  startPartyActivity(activtyName: string, startingArgs: PartyActivityStartArgs) {
    if (this.getPartyActivity(startingArgs.partyId)) return;

    const activityHandler = this.getActivityHandler(activtyName);
    if (activityHandler.isRunnable(startingArgs)) {
      const activityState = activityHandler.start(startingArgs);
      const activity = this.activityStore.add({ name: activtyName, state: activityState, type: ActivityType.Party, startArgs: startingArgs });
      this.partyService.setPartyActivity(startingArgs.partyId, activity.id);
      if (startingArgs.involvedPartyId) {
        this.partyService.setPartyActivity(startingArgs.involvedPartyId, activity.id);
      }
    }
  }

  getPartyActivity(partyId: string) {
    return this.partyService.getParty(partyId).activityId;
  }

  runActivites() {
    forEach(activity => this.executeActivity(activity), values(this.activityStore.getState()));
  }

  private executeActivity(activity: PartyActivity) {
    const activityHandler = this.getActivityHandler(activity.name);
    const activityNewState = activityHandler.execute(activity);
    const updatedActivity = assoc('state', activityNewState, activity);
    const isDone = activityHandler.isDone(updatedActivity);

    if (isDone) {
      activityHandler.resolve(updatedActivity);
      this.activityStore.remove(activity.id);
      this.partyService.setPartyActivity(activity.startArgs.partyId, undefined);
      if (activity.startArgs.involvedPartyId) {
        this.partyService.setPartyActivity(activity.startArgs.involvedPartyId, undefined);
      }
    } else {
      this.activityStore.update(activity.id, updatedActivity);
    }
  }
}
