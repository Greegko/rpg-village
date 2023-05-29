import { injectable } from "inversify";
import { append, evolve, find, values } from "rambda";

import { EventSystem } from "@core";

import { EffectStatic } from "@models";
import { Turn } from "@modules/game";

import { Map, MapEvent, MapID, MapLocation, MapLocationID, MapLocationType, MapSize } from "./interfaces";
import { MapLocationStore } from "./map-location-store";
import { MapStore } from "./map-store";

const MAP_TILE_SIZE: Record<MapSize, number> = {
  [MapSize.Small]: 40,
  [MapSize.Endless]: Infinity,
};

@injectable()
export class MapService {
  constructor(
    private mapLocationStore: MapLocationStore,
    private mapStore: MapStore,
    private eventSystem: EventSystem,
  ) {}

  createMap(
    mapLocationType: MapLocationType.Portal | MapLocationType.Village,
    mapSize: MapSize,
    modifiers: EffectStatic[],
  ): Map {
    const mapLocationId = this.createLocation(0, 0, true, mapLocationType).id;

    const map = this.mapStore.add({
      difficulty: 0,
      mapLocationIds: [mapLocationId],
      mapSize,
      modifiers,
    });

    this.revealLocation(mapLocationId);

    return map;
  }

  removeMap(mapId: MapID) {
    this.mapStore.remove(mapId);
  }

  createLocation(x: number, y: number, explored: boolean, type: MapLocationType): MapLocation {
    return this.mapLocationStore.add({ x, y, explored, type, partyIds: [] });
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

    const newUnexploredLocations = this.getUnexploredLocationsNextToLocation(locations, location, map.mapSize);

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
    mapSize: MapSize,
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
    ] as const;

    const neighbours = mapLocations.filter(loc => Math.abs(nx(loc.x)) <= 1 && Math.abs(ny(loc.y)) <= 2);

    const openPositions = positions.filter(
      pos => neighbours.findIndex(neighbour => nx(neighbour.x) === pos[0] && ny(neighbour.y) === pos[1]) === -1,
    );

    const newTiles = [];
    let hasBoss = !!mapLocations.find(x => x.type === MapLocationType.Boss);

    for (let position of openPositions) {
      const bossIsTriggerable = MAP_TILE_SIZE[mapSize] <= mapLocations.length + newTiles.length;
      const newTile = generateTile(mapLocation, position, hasBoss, bossIsTriggerable);
      hasBoss = hasBoss || newTile.type === MapLocationType.Boss;
      newTiles.push(newTile);
    }

    return newTiles;
  }
}

function mapLocationFactory(type: MapLocationType, x: number, y: number): Omit<MapLocation, "id"> {
  return { type, explored: false, x, y, partyIds: [] };
}

const generateTile = (
  mapLocation: MapLocation,
  position: readonly [number, number],
  hasBoss: boolean,
  bossIsTriggerable: boolean,
) => {
  const type = hasBoss ? MapLocationType.Empty : bossIsTriggerable ? MapLocationType.Boss : MapLocationType.Field;
  return mapLocationFactory(type, position[0] + mapLocation.x, position[1] + mapLocation.y);
};
