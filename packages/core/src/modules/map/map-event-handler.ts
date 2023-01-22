import { injectable } from "inversify";

import { eventHandler } from "@core/event";

import { EffectStatic } from "@models/effect";
import { PartyOwner, PartyService } from "@modules/party";
import { UnitStore } from "@modules/unit";

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
  ) {}

  @eventHandler(MapEvent.NewLocation)
  newLocation(args: MapEventNewLocationArgs) {
    const location = this.mapLocationStore.get(args.locationId);
    const map = this.mapStore.get(args.mapId);

    if (location.type === MapLocationType.Empty) return;

    if (location.type === MapLocationType.Boss) {
      this.addEnemyUnitToMap(args.mapId, args.locationId, map.modifiers);
    } else {
      this.addEnemyUnitToMap(args.mapId, args.locationId, map.modifiers);
    }
  }

  private addEnemyUnitToMap(mapId: MapID, locationId: MapLocationID, effects: EffectStatic[]) {
    const party = generateEnemyParty(this.mapStore.get(mapId).difficulty, effects);
    const unitIds = party.units.map(unit => this.unitStore.add(unit)).map(x => x.id);

    this.partyService.createParty({
      locationId,
      owner: PartyOwner.Enemy,
      unitIds: unitIds,
      stash: party.stash,
    });
  }
}
