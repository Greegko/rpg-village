import { injectable } from 'inversify';
import { EntityStore } from "../../lib/entity-store";
import { MapLocation, MapLocationID } from './interfaces';

@injectable()
export class WorldStore extends EntityStore<MapLocation, MapLocationID> {
  exploreLocation(locationId: MapLocationID): void {
    this.update(locationId, { explored: true });
  }
}
