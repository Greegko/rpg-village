import { inject, injectable } from 'inversify';
import { Turn, EventSystem } from '@greegko/rpg-model';
import { WorldStore } from './world-store';
import { WorldEvents } from './world-events';
import { generate } from 'shortid';
import { MapLocationType, MapLocation, MapLocationID } from './interfaces';

@injectable()
export class WorldMap {

  constructor(
    @inject('WorldStore') private worldStore: WorldStore,
    @inject('EventSystem') private eventSystem: EventSystem
  ){ }

  createLocation(x: number, y: number, explored: boolean, type: MapLocationType): MapLocationID {
    const locationId = generate();
    this.worldStore.addLocation({ x, y, explored, type, id: locationId });
    return locationId;
  }

  getDistance(locationAId: MapLocationID, locationBId: MapLocationID): Turn {
    const locationA = this.worldStore.getLocation(locationAId);
    const locationB = this.worldStore.getLocation(locationBId);

    return Math.abs(locationA.x - locationB.x) * 5 + Math.abs(locationA.y - locationB.y) * 5;
  }

  getExplorableLocations(): MapLocationID[] {
    return this.worldStore.getLocations().filter(x => !x.explored).map(x => x.id);
  }

  exploreLocation(locationId: MapLocationID){
    this.worldStore.exploreLocation(locationId);

    const location = this.worldStore.getLocation(locationId);

    const newUnexploredLocations = this._getUnexploredLocationsNextToLocation(this.worldStore.getLocations(), location);
    for(const unexploredLocation of newUnexploredLocations){
      this.worldStore.addLocation(unexploredLocation);
      this.eventSystem.fire(WorldEvents.NewLocation, { location: unexploredLocation });
    }
  }

  private _getUnexploredLocationsNextToLocation(locations: MapLocation[], location: MapLocation): MapLocation[] {
    const nx = (x) => x - location.x;
    const ny = (y) => y - location.y;

    const positions = [[0, -2], [0, 2], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    const neighbours = locations.filter(loc =>
      Math.abs(nx(loc.x)) <= 1 &&
      Math.abs(ny(loc.y)) <= 2
    );

    const emptyPositions = positions.filter(
      pos => neighbours.findIndex(neighbour =>
        nx(neighbour.x) == pos[0] &&
        ny(neighbour.y) == pos[1]
      ) === -1
    );

    return emptyPositions.map(
      position => this.locationFactory(MapLocationType.Field, position[0] + location.x, position[1] + location.y)
    );
  }

  private locationFactory(type: MapLocationType, x: number, y: number): MapLocation {
    return { id: generate(), type, explored: false, x, y };
  }

}
