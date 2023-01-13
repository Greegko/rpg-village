import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { MapLocationType, MapService, MapSize } from "@modules/map";
import { PartyStore } from "@modules/party";
import { VillageStashService, VillageStore } from "@modules/village";

import {
  PortalsCommand,
  PortalsCommandEnterPortalArgs,
  PortalsCommandLeavePortalArgs,
  PortalsCommandOpenPortalArgs,
} from "./portals-command";

@injectable()
export class PortalsCommandHandler {
  constructor(
    private mapService: MapService,
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
      this.mapService.createMap(MapLocationType.Portal, MapSize.Small);
    }
  }
}
