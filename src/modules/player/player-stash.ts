import { injectable, inject } from 'inversify';
import { where, map, lt } from 'ramda';
import { Resource } from '../../models';
import { PlayerStore } from './player-store';
import { addResource, removeResource, getResource } from '../../models/stash';

@injectable()
export class PlayerStash {

  constructor(
    @inject('PlayerStore') private playerStore: PlayerStore,
  ) { }

  addResource(resource: Resource): void {
    const stash = this.playerStore.getState().stash;
    const newStashResource = addResource(stash, resource);
    this.playerStore.set('stash', newStashResource);
  }

  removeResource(resource: Resource): void {
    const stash = this.playerStore.getState().stash;
    const newStashResource = removeResource(stash, resource);
    this.playerStore.set('stash', newStashResource);
  }

  getResource(): Resource {
    const stash = this.playerStore.getState().stash;
    return getResource(stash);
  }

  isEnoughResource(resource: Resource): boolean {
    const storeResource = this.getResource();
    const resourceObjCheck = map(lt, resource);
    return where(resourceObjCheck, storeResource);
  }
}
