import { injectable } from "inversify";

import { eventHandler } from "@core/event";

import { PartyOwner, PartyService } from "@modules/party";
import { UnitStore } from "@modules/unit";

import { MapEvent, MapEventNewLocationArgs, MapID, MapLocationID } from "./interfaces";
import { generateEnemyParty } from "./lib";
import { MapStore } from "./map-store";

@injectable()
export class MapEventHandler {
  constructor(private partyService: PartyService, private unitStore: UnitStore, private mapStore: MapStore) {}

  @eventHandler(MapEvent.NewLocation)
  newLocation(args: MapEventNewLocationArgs) {
    this.addEnemyUnitToMap(args.mapId, args.locationId);
  }

  private addEnemyUnitToMap(mapId: MapID, locationId: MapLocationID) {
    const party = generateEnemyParty(this.mapStore.get(mapId).difficulty);
    const unitIds = party.units.map(unit => this.unitStore.add(unit)).map(x => x.id);

    this.partyService.createParty({
      locationId,
      owner: PartyOwner.Enemy,
      unitIds: unitIds,
      stash: party.stash,
    });
  }
}
