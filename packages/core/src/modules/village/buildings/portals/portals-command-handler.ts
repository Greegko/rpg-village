import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { Map } from "@modules/map";
import { VillageStashService, VillageStore } from "@modules/village";
import { PartyStore } from "@modules/party";
import {
  PortalsCommand,
  PortalsCommandEnterPortalArgs,
  PortalsCommandLeavePortalArgs,
  PortalsCommandOpenPortalArgs,
} from "./portals-command";

@injectable()
export class PortalsCommandHandler {
  constructor(
    private map: Map,
    private villageStashService: VillageStashService,
    private partyStore: PartyStore,
    private villageStore: VillageStore,
  ) {}

  @commandHandler(PortalsCommand.EnterPortal)
  enterPartyInPortal(args: PortalsCommandEnterPortalArgs) {
    const party = this.partyStore.get(args.partyId);
    const villageLocationId = this.villageStore.getState().locationId;

    if (party.locationId === villageLocationId) {
      this.partyStore.setLocation(args.partyId, args.portalLocationId);
    }
  }

  @commandHandler(PortalsCommand.LeavePortal)
  leavePartyInPortal(args: PortalsCommandLeavePortalArgs) {
    const party = this.partyStore.get(args.partyId);
    const villageLocationId = this.villageStore.getState().locationId;

    if (party.locationId === args.portalLocationId) {
      this.partyStore.setLocation(args.partyId, villageLocationId);
    }
  }

  @commandHandler(PortalsCommand.OpenPortal)
  openPortal(args: PortalsCommandOpenPortalArgs) {
    const item = this.villageStashService.takeItem(args.dungeonKeyId);

    if (item) {
      this.map.createMap();
    }
  }
}
