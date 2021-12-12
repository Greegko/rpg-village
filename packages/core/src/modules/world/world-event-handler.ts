import { injectable } from "inversify";
import { EventSystem, EventHandler } from "@core/event";
import { PartyService, PartyOwner } from "@modules/party";
import { UnitService } from "@modules/unit";
import { GeneralGameStore } from "@modules/game";
import { WorldEvent, MapLocationID, NewLocationEventArgs } from "./interfaces";
import { generateEnemyParty } from "./lib";

@injectable()
export class WorldEventHandler implements EventHandler {
  constructor(
    private partyService: PartyService,
    private unitService: UnitService,
    private generalGameStore: GeneralGameStore
  ) {}

  init(eventSystem: EventSystem) {
    eventSystem.on(WorldEvent.NewLocation, (args: NewLocationEventArgs) => this.addEnemyUnitToMap(args.locationId));
  }

  private addEnemyUnitToMap(locationId: MapLocationID) {
    const party = generateEnemyParty(this.generalGameStore.get('difficulty')); 
    const unitIds = party.units.map(unit => this.unitService.addUnit(unit));

    this.partyService.createParty({
      locationId,
      owner: PartyOwner.Enemy,
      unitIds: unitIds,
      stash: party.stash,
    });
  }
}
