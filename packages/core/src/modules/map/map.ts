import { propEq, values } from "ramda";
import { EventSystem } from "@core/event";
import { injectable } from "inversify";
import { MapStore } from "./map-store";
import { Turn } from "../game";
import { MapLocationType, MapLocation, MapLocationID, MapEvent, MapID } from "./interfaces";

@injectable()
export class Map {
  constructor(private mapStore: MapStore, private eventSystem: EventSystem) {}

  createLocation(x: number, y: number, explored: boolean, type: MapLocationType, mapId: MapID): MapLocationID {
    return this.mapStore.add({ x, y, explored, type, mapId }).id;
  }

  getDistance(locationAId: MapLocationID, locationBId: MapLocationID): Turn {
    const locationA = this.mapStore.get(locationAId);
    const locationB = this.mapStore.get(locationBId);

    return Math.abs(locationA.x - locationB.x) * 5 + Math.abs(locationA.y - locationB.y) * 5;
  }

  exploreLocation(locationId: MapLocationID): void {
    this.mapStore.update(locationId, { explored: true });
    this.revealLocation(locationId);
  }

  revealLocation(locationId: MapLocationID) {
    const location = this.mapStore.get(locationId);

    const mapId = location.mapId;

    const newUnexploredLocations = this.getUnexploredLocationsNextToLocation(
      values(this.mapStore.getState()).filter(propEq("mapId", mapId)),
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
      this.locationFactory(location.mapId, MapLocationType.Field, position[0] + location.x, position[1] + location.y),
    );
  }

  private locationFactory(mapId: MapID, type: MapLocationType, x: number, y: number): Omit<MapLocation, "id"> {
    return { type, explored: false, x, y, mapId };
  }
}
