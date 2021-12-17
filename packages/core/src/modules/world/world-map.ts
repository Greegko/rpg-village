import { values } from "ramda";
import { EventSystem } from "@core/event";
import { injectable } from "inversify";
import { WorldStore } from "./world-store";
import { Turn } from "../game";
import { MapLocationType, MapLocation, MapLocationID, WorldEvent } from "./interfaces";

@injectable()
export class WorldMap {
  constructor(private worldStore: WorldStore, private eventSystem: EventSystem) {}

  createLocation(x: number, y: number, explored: boolean, type: MapLocationType): MapLocationID {
    return this.worldStore.add({ x, y, explored, type }).id;
  }

  getDistance(locationAId: MapLocationID, locationBId: MapLocationID): Turn {
    const locationA = this.worldStore.get(locationAId);
    const locationB = this.worldStore.get(locationBId);

    return Math.abs(locationA.x - locationB.x) * 5 + Math.abs(locationA.y - locationB.y) * 5;
  }

  getExplorableLocations(): MapLocationID[] {
    return values(this.worldStore.getState())
      .filter(x => !x.explored)
      .map(x => x.id);
  }

  exploreLocation(locationId: MapLocationID): void {
    this.worldStore.update(locationId, { explored: true });
    this.revealNewLocations(locationId);
  }

  revealNewLocations(locationId: MapLocationID) {
    const location = this.worldStore.get(locationId);

    const newUnexploredLocations = this.getUnexploredLocationsNextToLocation(
      values(this.worldStore.getState()),
      location,
    );
    for (const unexploredLocation of newUnexploredLocations) {
      const newLocationId = this.worldStore.add(unexploredLocation).id;
      this.eventSystem.fire(WorldEvent.NewLocation, {
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
