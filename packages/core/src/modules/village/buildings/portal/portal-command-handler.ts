import { injectable } from "inversify";

import { commandHandler } from "@core";

import { EffectStatic } from "@models";
import { DungeonKey } from "@models";
import { ActivityManager } from "@modules/activity";
import { MapLocationType, MapService, MapSize, PartyMapService } from "@modules/map";
import { MapLocationStore } from "@modules/map/map-location-store";
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
    private partyMapService: PartyMapService,
    private villageStashService: VillageStashService,
    private villageStore: VillageStore,
    private activityManager: ActivityManager,
    private mapLocationStore: MapLocationStore,
  ) {}

  @commandHandler(PortalCommand.EnterPortal)
  enterPartyInPortal(args: PortalCommandEnterPortalArgs) {
    const partyLocation = this.partyMapService.getPartyLocation(args.partyId);
    const villageLocationId = this.villageStore.getState().locationId;

    if (partyLocation && partyLocation.id === villageLocationId) {
      this.partyMapService.setLocation(args.partyId, args.portalLocationId);
    }
  }

  @commandHandler(PortalCommand.LeavePortal)
  leavePartyInPortal(args: PortalCommandLeavePortalArgs) {
    const location = this.partyMapService.getPartyLocation(args.partyId);
    if (location && location.id !== args.portalLocationId) return;

    const map = this.mapService.getMapByLocation(args.portalLocationId);

    const villageLocationId = this.villageStore.getState().locationId;

    this.partyMapService.setLocation(args.partyId, villageLocationId);

    const bossMapLocation = map.mapLocationIds
      .map(x => this.mapLocationStore.get(x))
      .find(x => x.type === MapLocationType.Boss);

    if (bossMapLocation?.explored) {
      const bossUnits = this.partyMapService.getPartiesOnLocation(bossMapLocation.id);

      if (bossUnits.length === 0) {
        this.activityManager.startActivity(PortalActivity.GatherResourceFromPortal, {
          resource: { gold: map.mapLocationIds.length * 25 },
        });
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
