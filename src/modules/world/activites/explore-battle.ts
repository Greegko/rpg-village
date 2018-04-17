import { injectable, inject } from 'inversify';
import { LocationID, IActivityTaskHandler, ActivityTask, PartyService, PartyID, PartyOwner } from '@greegko/rpg-model';
import { BattleActivity } from '../../battle/activities';

export type ExploreBattleState = {
  locationId: LocationID;
};

export type ExploreBattleStartArgs = ExploreBattleState;

@injectable()
export class ExploreBattleActivity implements IActivityTaskHandler<ExploreBattleStartArgs, ExploreBattleState> {

  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('BattleActivity') private battleActivity: BattleActivity
  ){ }

  start(partyId: PartyID, { locationId }: ExploreBattleStartArgs): ActivityTask<ExploreBattleState> {
    return {
      type: 'explore-battle',
      partyId,
      state: {
        locationId
      }
    };
  }

  isRunnable(partyId: PartyID, { locationId }: Partial<ExploreBattleStartArgs>): boolean {
    const parties = this.partyService.getPartiesOnLocation(locationId);
    const hostileParty = parties.find(party => party.owner !== PartyOwner.Player);
    return hostileParty !== undefined;
  }

  getSubTask({ state, partyId }: ActivityTask<ExploreBattleState>): ActivityTask<any> {
    const parties = this.partyService.getPartiesOnLocation(state.locationId);
    const hostileParty = parties.find(party => party.owner !== PartyOwner.Player);

    if (this.battleActivity.isRunnable(partyId, { enemyPartyId: hostileParty.id })) {
      return this.battleActivity.start(partyId, { enemyPartyId: hostileParty.id });
    }
  }

  execute({ state }: ActivityTask<ExploreBattleState>): ExploreBattleState {
    return state;
  }

  isDone({ state }: ActivityTask<ExploreBattleState>): boolean {
    return true;
  }

  resolve({ state }: ActivityTask<ExploreBattleState>) { }

}