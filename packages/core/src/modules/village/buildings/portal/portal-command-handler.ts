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
  PortalCommand,
  PortalCommandEnterPortalArgs,
  PortalCommandLeavePortalArgs,
  PortalCommandOpenPortalArgs,
} from "./portal-command";

@injectable()
export class PortalCommandHandler {
  constructor(
    private mapService: MapService,
    private villageStashService: VillageStashService,
    private partyStore: PartyStore,
    private villageStore: VillageStore,
    private partyService: PartyService,
    private activityManager: ActivityManager,
  ) {}

  @commandHandler(PortalCommand.EnterPortal)
  enterPartyInPortal(args: PortalCommandEnterPortalArgs) {
    const party = this.partyStore.get(args.partyId);
    const villageLocationId = this.villageStore.getState().locationId;

    if (party.locationId === villageLocationId) {
      this.partyStore.setLocation(args.partyId, args.portalLocationId);
    }
  }

  @commandHandler(PortalCommand.LeavePortal)
  leavePartyInPortal(args: PortalCommandLeavePortalArgs) {
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

  @commandHandler(PortalCommand.OpenPortal)
  openPortal(args: PortalCommandOpenPortalArgs) {
    const item = this.villageStashService.takeItem<DungeonKey>(args.dungeonKeyId);

    if (item) {
      this.mapService.createMap(MapLocationType.Portal, MapSize.Small, item.effects as EffectStatic[]);
    }
  }
}
