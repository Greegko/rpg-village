import { EventHandler } from "../../models";
import { EventSystem } from "../../lib/event-system";
import { injectable, inject } from "inversify";
import { WorldEvent, MapLocationID, NewLocationEventArgs } from "./interfaces";
import { PartyService, PartyOwner } from "../party";
import { UnitService } from "../unit";
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
