import { injectable, inject } from 'inversify';
import { IActivityTaskHandler, ActivityTask, PartyID, PartyOwner } from '@greegko/rpg-model';
import { BattleActivity } from '../../battle/activities';
import { MapLocationID } from '../interfaces';
import { PartyLocationService } from '../../party';

export type ExploreBattleState = {
  locationId: MapLocationID;
};

export type ExploreBattleStartArgs = ExploreBattleState;

@injectable()
export class ExploreBattleActivity implements IActivityTaskHandler<ExploreBattleStartArgs, ExploreBattleState> {

  constructor(
    @inject('PartyLocationService') private partyLocationService: PartyLocationService,
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
    const parties = this.partyLocationService.getPartiesOnLocation(locationId);
    const hostileParty = parties.find(party => party.owner !== PartyOwner.Player);
    return hostileParty !== undefined;
  }

  getSubTask({ state, partyId }: ActivityTask<ExploreBattleState>): ActivityTask<any> {
    const parties = this.partyLocationService.getPartiesOnLocation(state.locationId);
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