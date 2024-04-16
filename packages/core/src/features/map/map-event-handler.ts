import { injectable } from "inversify";
import { append, evolve, find, values, without } from "rambda";

import { eventHandler } from "@core";

import { ActivityStore } from "@features/activity";
import { EffectStatic } from "@features/effect";
import { PartyEvent, PartyEventDisbandArgs, PartyOwner, PartyService } from "@features/party";
import { UnitStore } from "@features/unit";

import { MapEvent, MapEventNewLocationArgs, MapID, MapLocationID, MapLocationType } from "./interfaces";
import { generateEnemyParty } from "./lib";
import { MapLocationStore } from "./map-location-store";
import { MapStore } from "./map-store";

@injectable()
export class MapEventHandler {
  constructor(
    private partyService: PartyService,
    private unitStore: UnitStore,
    private mapStore: MapStore,
    private mapLocationStore: MapLocationStore,
    private activityStore: ActivityStore,
  ) {}

  @eventHandler(MapEvent.NewLocation)
  newLocation(args: MapEventNewLocationArgs) {
    const location = this.mapLocationStore.get(args.locationId);
    const map = this.mapStore.get(args.mapId);

    if (location.type === MapLocationType.Empty) return;

    if (location.type === MapLocationType.Boss) {
      this.addEnemyUnitToMap(args.mapId, args.locationId, map.modifiers || []);
    } else {
      this.addEnemyUnitToMap(args.mapId, args.locationId, map.modifiers || []);
    }
  }

  private addEnemyUnitToMap(mapId: MapID, locationId: MapLocationID, effects: EffectStatic[]) {
    const generatedParty = generateEnemyParty(this.mapStore.get(mapId).difficulty, effects);
    const unitIds = generatedParty.units.map(unit => this.unitStore.add(unit)).map(x => x.id);

    const party = this.partyService.createParty({
      owner: PartyOwner.Enemy,
      unitIds: unitIds,
      stash: generatedParty.stash,
    });

    this.mapLocationStore.update(locationId, evolve({ partyIds: append(party.id) }));
  }

  @eventHandler(PartyEvent.Disband)
  onDisbandPartyRemovePartyFromMap(args: PartyEventDisbandArgs) {
    const mapLocation = find(x => x.partyIds.includes(args.partyId), values(this.mapLocationStore.getState()));

    if (mapLocation === undefined) return;

    this.mapLocationStore.update(mapLocation.id, evolve({ partyIds: without([args.partyId]) }));
  }

  @eventHandler(PartyEvent.Disband)
  onDisbandPartyRemovePartyActiveActivity(args: PartyEventDisbandArgs) {
    const partyActivity = find(
      x => (x.startArgs as { partyId?: string })?.partyId === args.partyId,
      values(this.activityStore.getState()),
    );

    if (partyActivity === undefined) return;

    this.activityStore.remove(partyActivity.id);
  }
}
