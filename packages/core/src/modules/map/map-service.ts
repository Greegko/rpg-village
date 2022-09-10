import { injectable } from "inversify";
import { append, evolve, find, values } from "ramda";

import { EventSystem } from "@core/event";

import { Turn } from "../game";
import { Map, MapEvent, MapID, MapLocation, MapLocationID, MapLocationType } from "./interfaces";
import { MapLocationStore } from "./map-location-store";
import { MapStore } from "./map-store";

@injectable()
export class MapService {
  constructor(
    private mapLocationStore: MapLocationStore,
    private mapStore: MapStore,
    private eventSystem: EventSystem,
  ) {}

  createMap(mapLocationType: MapLocationType.Portal | MapLocationType.Village = MapLocationType.Portal): Map {
    const mapLocationId = this.createLocation(0, 0, true, mapLocationType).id;

    const map = this.mapStore.add({
      difficulty: 0,
      mapLocationIds: [mapLocationId],
    });

    this.revealLocation(mapLocationId);

    return map;
  }

  createLocation(x: number, y: number, explored: boolean, type: MapLocationType): MapLocation {
    return this.mapLocationStore.add({ x, y, explored, type });
  }

  addLocationToMap(mapId: MapID, mapLocation: Omit<MapLocation, "id">): MapLocation {
    const newLocation = this.mapLocationStore.add(mapLocation);

    this.mapStore.update(mapId, evolve({ mapLocationIds: append(newLocation.id) }));

    return newLocation;
  }

  getDistance(locationAId: MapLocationID, locationBId: MapLocationID): Turn {
    const locationA = this.mapLocationStore.get(locationAId);
    const locationB = this.mapLocationStore.get(locationBId);

    return Math.abs(locationA.x - locationB.x) * 5 + Math.abs(locationA.y - locationB.y) * 5;
  }

  exploreLocation(locationId: MapLocationID): void {
    this.mapLocationStore.update(locationId, { explored: true });
    this.revealLocation(locationId);
  }

  getMapByLocation(locationId: MapLocationID): Map {
    return find(x => x.mapLocationIds.includes(locationId), values(this.mapStore.getState()))!;
  }

  revealLocation(locationId: MapLocationID) {
    const location = this.mapLocationStore.get(locationId);
    const map = this.getMapByLocation(location.id);
    const locations = map.mapLocationIds.map(x => this.mapLocationStore.get(x));

    const newUnexploredLocations = this.getUnexploredLocationsNextToLocation(locations, location);

    for (const unexploredLocation of newUnexploredLocations) {
      const newLocation = this.addLocationToMap(map.id, unexploredLocation);

      this.eventSystem.fire(MapEvent.NewLocation, {
        mapId: map.id,
        locationId: newLocation.id,
      });
    }
  }

  private getUnexploredLocationsNextToLocation(
    mapLocations: MapLocation[],
    mapLocation: MapLocation,
  ): Omit<MapLocation, "id">[] {
    const nx = (x: number) => x - mapLocation.x;
    const ny = (y: number) => y - mapLocation.y;

    const positions = [
      [0, -2],
      [0, 2],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    const neighbours = mapLocations.filter(loc => Math.abs(nx(loc.x)) <= 1 && Math.abs(ny(loc.y)) <= 2);

    const emptyPositions = positions.filter(
      pos => neighbours.findIndex(neighbour => nx(neighbour.x) == pos[0] && ny(neighbour.y) == pos[1]) === -1,
    );

    return emptyPositions.map(position =>
      this.mapLocationFactory(MapLocationType.Field, position[0] + mapLocation.x, position[1] + mapLocation.y),
    );
  }

  private mapLocationFactory(type: MapLocationType, x: number, y: number): Omit<MapLocation, "id"> {
    return { type, explored: false, x, y };
  }
}
