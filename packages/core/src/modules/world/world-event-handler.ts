import { injectable, inject } from "inversify";
import { EventSystem, EventHandler } from "@core/event";
import { PartyService, PartyOwner } from "@modules/party";
import { UnitService } from "@modules/unit";
import { WorldEvent, MapLocationID, NewLocationEventArgs } from "./interfaces";
import { generateEnemy } from "./lib";

@injectable()
export class WorldEventHandler implements EventHandler {
  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('UnitService') private unitService: UnitService,
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(WorldEvent.NewLocation, (args: NewLocationEventArgs) => this.addEnemyUnitToMap(args.locationId));
  }

  private addEnemyUnitToMap(locationId: MapLocationID) {
    const unitId = this.unitService.addUnit(generateEnemy());

    this.partyService.createParty({
      locationId,
      owner: PartyOwner.Enemy,
      unitIds: [unitId],
      stash: { resource: { gold: 0 }, items: [] }
    });
  }
}
