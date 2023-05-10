import { injectable } from "inversify";
import { flatten } from "rambda";

import { commandHandler } from "@core/command";
import { withoutBy } from "@lib/without-by";

import { EffectStatic } from "@models/effect";
import { DungeonKey } from "@models/item";
import { ActivityManager } from "@modules/activity";
import { MapLocationType, MapService, MapSize } from "@modules/map";
import { PartyService, PartyStore } from "@modules/party";
import { PortalActivity, VillageStashService, VillageStore } from "@modules/village";

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
    private partyService: PartyService,
    private activityManager: ActivityManager,
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
    const map = this.mapService.getMapByLocation(args.portalLocationId);
    const party = this.partyStore.get(args.partyId);
    const villageLocationId = this.villageStore.getState().locationId;

    const allPartiesInMap = flatten(
      map.mapLocationIds.map(locationId => this.partyService.getPartiesOnLocation(locationId)),
    );

    const parties = withoutBy(allPartiesInMap, [party], x => x.id);

    if (party.locationId === args.portalLocationId) {
      this.partyStore.setLocation(args.partyId, villageLocationId);

      if (map.mapSize === map.mapLocationIds.length && parties.length === 1) {
        this.activityManager.startActivity(PortalActivity.GatherResourceFromPortal, { resource: {} });
        this.mapService.removeMap(map.id);
      }
    }
  }

  @commandHandler(PortalsCommand.OpenPortal)
  openPortal(args: PortalsCommandOpenPortalArgs) {
    const item = this.villageStashService.takeItem<DungeonKey>(args.dungeonKeyId);

    if (item) {
      this.mapService.createMap(MapLocationType.Portal, MapSize.Small, item.effects as EffectStatic[]);
    }
  }
}
