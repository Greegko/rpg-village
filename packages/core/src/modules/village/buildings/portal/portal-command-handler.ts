import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { EffectStatic } from "@models/effect";
import { DungeonKey } from "@models/item";
import { ActivityManager } from "@modules/activity";
import { MapLocationType, MapService, MapSize } from "@modules/map";
import { MapLocationStore } from "@modules/map/map-location-store";
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
    private activityManager: ActivityManager,
    private partyService: PartyService,
    private mapLocationStore: MapLocationStore,
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
    const party = this.partyStore.get(args.partyId);
    if (party.locationId !== args.portalLocationId) return;

    const map = this.mapService.getMapByLocation(args.portalLocationId);

    const villageLocationId = this.villageStore.getState().locationId;

    this.partyStore.setLocation(args.partyId, villageLocationId);

    const bossMapLocation = map.mapLocationIds
      .map(x => this.mapLocationStore.get(x))
      .find(x => x.type === MapLocationType.Boss);

    if (bossMapLocation?.explored) {
      const bossUnits = this.partyService.getPartiesOnLocation(bossMapLocation.id);

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
