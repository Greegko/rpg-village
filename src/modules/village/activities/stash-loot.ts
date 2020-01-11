import { injectable, inject } from 'inversify';
import { PartyService, PartyID } from "../../party";
import { IActivityHandler, Activity } from '../../activity/interfaces';
import { MapLocationID } from '../../world/interfaces';
import { getResource, getItems, removeResource, removeItems, ResourceStash, ItemStash } from '../../../models/stash';
import { prop, pipe } from 'ramda';
import { VillageStash } from '../village-stash';

export type StashLootState = {
  villageLocationId: MapLocationID;
  partyId: PartyID;
};

export type StashLootStartArgs = StashLootState;

@injectable()
export class StashLootActivity implements IActivityHandler<StashLootStartArgs, StashLootState> {

  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('VillageStash') private villageStash: VillageStash,
  ) { }

  start({ partyId, villageLocationId }: StashLootStartArgs): StashLootState {
    return {
      partyId,
      villageLocationId
    };
  }

  isRunnable({ partyId, villageLocationId }: Partial<StashLootStartArgs>): boolean {
    const party = this.partyService.getParty(partyId);

    return party.locationId === villageLocationId;
  }

  execute({ state }: Activity<StashLootState>): StashLootState {
    return state;
  }

  isDone(_: Activity<StashLootState>): boolean {
    return true;
  }

  resolve({ state: { partyId } }: Activity<StashLootState>) {
    const partyStash = this.partyService.getParty(partyId).stash;
    const partyResource = getResource(partyStash);
    const partyItems = getItems(partyStash);

    const newPartyStash = pipe(
      (stash: ResourceStash & ItemStash) => removeResource(stash, partyResource),
      (stash: ResourceStash & ItemStash) => removeItems(stash, partyItems.map(prop('id')))
    )(partyStash);

    this.partyService.updateParty(partyId, { stash: newPartyStash });

    this.villageStash.addResource(partyResource);
    this.villageStash.addItems(partyItems);
  }
}