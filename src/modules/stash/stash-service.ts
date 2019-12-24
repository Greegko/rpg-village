import { injectable, inject } from "inversify";
import { StashStore } from "./stash-store";
import { StashID } from "./interfaces";

@injectable()
export class StashService {
  constructor(@inject('StashStore') private stashStore: StashStore<{}>) { }

  createStash(): StashID {
    const newStash = this.stashStore.add({});

    return newStash.id;
  }
}
