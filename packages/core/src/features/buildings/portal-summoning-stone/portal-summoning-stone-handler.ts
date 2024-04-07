import { append, evolve, inc } from "rambda";
import { generate } from "shortid";

import { Portal, PortalID } from "@features/buildings/portal";
import { MapLocationID } from "@features/map";

import { PortalSummoningStone } from "./interface";

export interface PortalSummoningStoneHandlerDelegator {
  get: () => PortalSummoningStone;
  update: (updater: (stash: PortalSummoningStone) => PortalSummoningStone) => void;
}

export class PortalSummoningStoneHandler {
  constructor(private delegator: PortalSummoningStoneHandlerDelegator) {}

  get state(): PortalSummoningStone {
    return this.delegator.get();
  }

  build() {
    if (this.delegator.get() === undefined) {
      this.delegator.update(() => ({ id: generate(), level: 1, portals: [] }));
    } else {
      this.delegator.update(evolve({ level: inc }));
    }
  }

  addPortal(connectedLocationId: MapLocationID) {
    const id = generate();
    this.delegator.update(evolve({ portals: append({ id, connectedLocationId }) }));
    return id;
  }

  removePortal(id: PortalID) {
    this.delegator.update(evolve({ portals: (portals: Portal[]) => portals.filter(x => x.id !== id) }));
  }
}
