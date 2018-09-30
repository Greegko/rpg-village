import { injectable, inject } from "inversify";
import { path, mergeWith, add, subtract } from 'ramda';
import { StashID, StashStore } from "@greegko/rpg-model";

@injectable()
export class StashResource<Resource extends object> {

  constructor(@inject('StashStore') private stashStore: StashStore<Resource>) {}

  getResource(stashId: StashID): Resource {
    return path([stashId, 'resource'], this.stashStore.get(stashId));
  }

  takeAllResource(stashId: StashID): Resource {
    const resource = path<Resource>([stashId, 'resource'], this.stashStore.get(stashId));
    this.removeResource(stashId, resource);
    return resource;
  }

  addResource(stashId: StashID, resource: Partial<Resource>): void {
    const stash = this.stashStore.get(stashId);
    this.stashStore.update(stashId, mergeWith(add, resource, stash));
  }

  removeResource(stashId: StashID, resource: Partial<Resource>): void {
    const stash = this.stashStore.get(stashId);
    this.stashStore.update(stashId, mergeWith(subtract, resource, stash));
  }

}
