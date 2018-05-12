import { injectable, inject } from 'inversify';
import { where, map, lt } from 'ramda';
import { StashResource } from '../stash';
import { Resource } from '../../models';
import { PlayerStore } from './player-store';

@injectable()
export class PlayerStash {

  constructor(
    @inject('PlayerStore') private playerStore: PlayerStore,
    @inject('StashResource') private stashResource: StashResource<Resource>,
  ){ }

  addResource(resource: Resource): void {
    this.stashResource.addResource(this.playerStore.getState().stashId, resource);
  }

  removeResource(resource: Resource): void {
    this.stashResource.removeResource(this.playerStore.getState().stashId, resource);
  }

  getResource(): Resource {
    return this.stashResource.getResource(this.playerStore.getState().stashId);
  }

  isEnoughResource(resource: Resource): boolean {
    const storeResource = this.getResource();
    const resourceObjCheck = map((x: number) => lt(x), resource);
    return where(resourceObjCheck, storeResource);
  }
}
