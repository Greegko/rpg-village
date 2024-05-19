import { forEach } from "remeda";
import { Observable, Subject, filter, map } from "rxjs";

import { getVectorDistance } from "../utils/vector";

type Position = { x: number; y: number };
type Sight = number;

type EntityID = string;

interface Entity {
  position: Position;
  sight: Sight;
}

type PositionString = `${number},${number}`;
function positionToString(x: number, y: number): PositionString {
  return `${x},${y}`;
}

const without = <T>(arr: T[], removeItems: T[]) => {
  return arr.filter(item => !removeItems.includes(item));
};

const createEntitySightStringPositions = (entity: Entity) => {
  const cordinates = [] as PositionString[];

  for (let dx = -entity.sight; dx < entity.sight + 1; dx++) {
    for (let dy = -entity.sight; dy < entity.sight + 1; dy++) {
      cordinates.push(positionToString(entity.position.x + dx, entity.position.y + dy));
    }
  }

  return cordinates;
};

export enum MapOpservatorEvent {
  EnterSight = "enter-sight",
  ExitSight = "exit-sight",
}

export class MapObservator {
  private entities: Record<EntityID, Entity> = {};
  private observationMap: Record<PositionString, EntityID[]> = {};
  private entitiesInSight: Record<EntityID, EntityID[]> = {};

  private callbacks: Record<EntityID, Record<string, Subject<EntityID>>> = {};

  onEnterExit(entityId: EntityID, eventType: MapOpservatorEvent): Observable<EntityID> {
    this.callbacks[entityId] ||= {};
    this.callbacks[entityId][eventType] ||= new Subject<EntityID>();

    return this.callbacks[entityId][eventType].asObservable();
  }

  addEntity(entityId: EntityID, position: Position, sight: Sight) {
    const entity = { position, sight };
    this.entities[entityId] = entity;

    const startObservationPositions = createEntitySightStringPositions(entity);

    this.triggerEntryForPositionSet(entityId, position);
    this.triggerEntryEntitySight(entityId, startObservationPositions);
    this.setObservation(entityId, startObservationPositions);
  }

  removeEntity(entityId: EntityID) {
    const entity = this.entities[entityId];

    this.unsetObservation(entityId, createEntitySightStringPositions(entity));

    delete this.entities[entityId];
    delete this.callbacks[entityId];
    delete this.entitiesInSight[entityId];
  }

  distance(entityId: EntityID, targetEntityId: EntityID) {
    const entity = this.entities[entityId];
    const targetEntity = this.entities[targetEntityId];

    return getVectorDistance(entity.position, targetEntity.position);
  }

  updateEntity(entityId: EntityID, newPosition: Position, newSightRange?: number) {
    const entity = this.entities[entityId];

    if (!entity) return;

    const newEntity = {
      sight: newSightRange || entity.sight,
      position: newPosition,
    };

    this.entities[entityId] = newEntity;

    const originalSightPositions = createEntitySightStringPositions(entity);
    const newSightPosition = createEntitySightStringPositions(newEntity);

    const removeSightPositions = without(originalSightPositions, newSightPosition);
    const addSightPositions = without(newSightPosition, originalSightPositions);

    this.triggerExitEntitySight(entityId, removeSightPositions);
    this.unsetObservation(entityId, removeSightPositions);

    this.triggerEntryEntitySight(entityId, addSightPositions);
    this.setObservation(entityId, addSightPositions);

    this.triggerEntryForPositionSet(entityId, newPosition);
    this.triggerExitForPositionSet(entityId, entity.position);
  }

  private triggerEntryForPositionSet(entityId: EntityID, newPosition: Position) {
    const newPositionObservers = this.observationMap[positionToString(newPosition.x, newPosition.y)];
    forEach(newPositionObservers || [], observerId => {
      if (observerId === entityId) return;

      this.triggerEntryEvent(observerId, entityId);
    });
  }

  private triggerExitForPositionSet(entityId: EntityID, oldPosition: Position) {
    const oldPositionObservers = this.observationMap[positionToString(oldPosition.x, oldPosition.y)];
    forEach(oldPositionObservers || [], observerId => {
      if (observerId === entityId) return;

      this.triggerExitEvent(observerId, entityId);
    });
  }

  private triggerEntryEntitySight(originEntityId: EntityID, positions: PositionString[]) {
    forEach(positions, position => {
      forEach(this.observationMap[position] || [], observerId => {
        if (originEntityId === observerId) return;

        this.triggerEntryEvent(originEntityId, observerId);
      });
    });
  }

  private triggerExitEntitySight(originEntityId: EntityID, positions: PositionString[]) {
    forEach(positions, position => {
      forEach(this.observationMap[position] || [], entityId => {
        if (originEntityId === entityId) return;

        this.triggerExitEvent(originEntityId, entityId);
      });
    });
  }

  private triggerExitEvent(observerId: EntityID, entityId: EntityID) {
    if (this.entitiesInSight[observerId] && this.entitiesInSight[observerId].includes(entityId)) {
      this.entitiesInSight[observerId] = without(this.entitiesInSight[observerId], [entityId]);
      if (this.entitiesInSight[observerId].length === 0) {
        delete this.entitiesInSight[observerId];
      }

      if (this.callbacks[observerId]) {
        this.callbacks[observerId][MapOpservatorEvent.ExitSight]?.next(entityId);
      }
    }
  }

  private triggerEntryEvent(observerId: EntityID, entityId: EntityID) {
    if (this.entitiesInSight[observerId] && this.entitiesInSight[observerId].includes(entityId)) return;

    this.entitiesInSight[observerId] ||= [];
    this.entitiesInSight[observerId] = [...this.entitiesInSight[observerId], entityId];

    if (this.callbacks[observerId]) {
      this.callbacks[observerId][MapOpservatorEvent.EnterSight]?.next(entityId);
    }
  }

  private setObservation(entityId: EntityID, cordinates: PositionString[]) {
    cordinates.forEach(pos => {
      this.observationMap[pos] ||= [];
      this.observationMap[pos].push(entityId);
    });
  }

  private unsetObservation(entityId: EntityID, cordinates: PositionString[]) {
    cordinates.forEach(pos => {
      this.observationMap[pos] = without(this.observationMap[pos], [entityId]);
      if (this.observationMap[pos].length === 0) {
        delete this.observationMap[pos];
      }
    });
  }
}
