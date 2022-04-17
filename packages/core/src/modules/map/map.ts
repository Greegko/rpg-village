import { values } from "ramda";
import { EventSystem } from "@core/event";
import { injectable } from "inversify";
import { MapStore } from "./map-store";
import { Turn } from "../game";
import { MapLocationType, MapLocation, MapLocationID, MapEvent } from "./interfaces";

@injectable()
export class Map {
  constructor(private mapStore: MapStore, private eventSystem: EventSystem) {}

  createLocation(x: number, y: number, explored: boolean, type: MapLocationType): MapLocationID {
    return this.mapStore.add({ x, y, explored, type }).id;
  }

  getDistance(locationAId: MapLocationID, locationBId: MapLocationID): Turn {
    const locationA = this.mapStore.get(locationAId);
    const locationB = this.mapStore.get(locationBId);

    return Math.abs(locationA.x - locationB.x) * 5 + Math.abs(locationA.y - locationB.y) * 5;
  }

  getExplorableLocations(): MapLocationID[] {
    return values(this.mapStore.getState())
      .filter(x => !x.explored)
      .map(x => x.id);
  }

  exploreLocation(locationId: MapLocationID): void {
    this.mapStore.update(locationId, { explored: true });
    this.revealNewLocations(locationId);
  }

  revealNewLocations(locationId: MapLocationID) {
    const location = this.mapStore.get(locationId);

    const newUnexploredLocations = this.getUnexploredLocationsNextToLocation(
      values(this.mapStore.getState()),
      location,
    );
    for (const unexploredLocation of newUnexploredLocations) {
      const newLocationId = this.mapStore.add(unexploredLocation).id;
      this.eventSystem.fire(MapEvent.NewLocation, {
        locationId: newLocationId,
      });
    }
  }

  private getUnexploredLocationsNextToLocation(
    locations: MapLocation[],
    location: MapLocation,
  ): Omit<MapLocation, "id">[] {
    const nx = (x: number) => x - location.x;
    const ny = (y: number) => y - location.y;

    const positions = [
      [0, -2],
      [0, 2],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    const neighbours = locations.filter(loc => Math.abs(nx(loc.x)) <= 1 && Math.abs(ny(loc.y)) <= 2);

    const emptyPositions = positions.filter(
      pos => neighbours.findIndex(neighbour => nx(neighbour.x) == pos[0] && ny(neighbour.y) == pos[1]) === -1,
    );

    return emptyPositions.map(position =>
      this.locationFactory(MapLocationType.Field, position[0] + location.x, position[1] + location.y),
    );
  }

  private locationFactory(type: MapLocationType, x: number, y: number): Omit<MapLocation, "id"> {
    return { type, explored: false, x, y };
  }
}
