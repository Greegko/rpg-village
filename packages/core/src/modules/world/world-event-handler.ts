import { injectable } from "inversify";
import { eventHandler } from "@core/event";
import { PartyService, PartyOwner } from "@modules/party";
import { UnitStore } from "@modules/unit";
import { GeneralGameStore } from "@modules/game";
import { WorldEvent, MapLocationID, NewLocationEventArgs } from "./interfaces";
import { generateEnemyParty } from "./lib";

@injectable()
export class WorldEventHandler {
  constructor(
    private partyService: PartyService,
    private unitStore: UnitStore,
    private generalGameStore: GeneralGameStore,
  ) {}

  @eventHandler(WorldEvent.NewLocation)
  newLocation(args: NewLocationEventArgs) {
    this.addEnemyUnitToMap(args.locationId);
  }

  private addEnemyUnitToMap(locationId: MapLocationID) {
    const party = generateEnemyParty(this.generalGameStore.get("difficulty"));
    const unitIds = party.units.map(unit => this.unitStore.add(unit)).map(x => x.id);

    this.partyService.createParty({
      locationId,
      owner: PartyOwner.Enemy,
      unitIds: unitIds,
      stash: party.stash,
    });
  }
}
