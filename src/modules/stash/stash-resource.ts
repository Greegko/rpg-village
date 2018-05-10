import { injectable, inject } from "inversify";
import { path, mergeWith, add, subtract } from 'ramda';
import { StashID, StashStore } from "@greegko/rpg-model";

@injectable()
export class StashResource<Resource> {

  constructor(@inject('StashStore') private stashStore: StashStore<Resource>) {}

  getResource(stashId: StashID): Resource {
    return path([stashId, 'resource'], this.stashStore.getStash(stashId));
  }

  takeAllResource(stashId: StashID): Resource {
    const resource = path<Resource>([stashId, 'resource'], this.stashStore.getStash(stashId));
    this.removeResource(stashId, resource);
    return resource;
  }

  addResource(stashId: StashID, resource: Partial<Resource>) {
    const stash = this.stashStore.getStash(stashId);
    this.stashStore.updateStash(stashId, mergeWith(add, resource, stash));
  }

  removeResource(stashId: StashID, resource: Partial<Resource>) {
    const stash = this.stashStore.getStash(stashId);
    this.stashStore.updateStash(stashId, mergeWith(subtract, resource, stash));
  }

}
