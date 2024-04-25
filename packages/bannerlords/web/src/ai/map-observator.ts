import { forEach } from "remeda";

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
  EnterRange,
  ExitRange,
}

type OnEnterCallback = (targetEntity: EntityID, distance: number) => void;
type OnExitCallback = (targetEntity: EntityID) => void;
type DisposeOnCallback = () => void;

export class MapObservator {
  private entities: Record<EntityID, Entity> = {};
  private observationMap: Record<PositionString, EntityID[]> = {};
  private entitiesInSight: Record<EntityID, EntityID[]> = {};

  private callbacks: Record<
    EntityID,
    Partial<
      Record<MapOpservatorEvent.EnterRange, OnEnterCallback[]> & Record<MapOpservatorEvent.ExitRange, OnExitCallback[]>
    >
  > = {};

  on(entityId: EntityID, eventType: MapOpservatorEvent.EnterRange, fn: OnEnterCallback): DisposeOnCallback;
  on(entityId: EntityID, eventType: MapOpservatorEvent.ExitRange, fn: OnExitCallback): DisposeOnCallback;
  on(entityId: EntityID, eventType: MapOpservatorEvent, fn: OnEnterCallback | OnExitCallback): DisposeOnCallback {
    this.callbacks[entityId] ||= {};
    this.callbacks[entityId][eventType] ||= [];
    this.callbacks[entityId][eventType] = [...this.callbacks[entityId]![eventType]!, fn] as any;

    return () => {
      this.callbacks[entityId][eventType] = without(this.callbacks[entityId][eventType]!, [fn]) as any;
    };
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
  }

  updateEntity(entityId: EntityID, newDiffPosition: Position, newSightRange?: number) {
    const entity = this.entities[entityId];

    console.log("Update", entityId, newDiffPosition);

    // TODO: Shouldn't allow race condition between Add and Update entry!
    if (!entity) return;

    const entityNewPosition = { x: entity.position.x + newDiffPosition.x, y: entity.position.y + newDiffPosition.y };

    const newEntity = {
      sight: newSightRange || entity.sight,
      position: entityNewPosition,
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

    this.triggerEntryForPositionSet(entityId, entityNewPosition);
    this.triggerExitForPositionSet(entityId, entity.position);
  }

  private triggerEntryForPositionSet(entityId: EntityID, newPosition: Position) {
    const newPositionObservers = this.observationMap[positionToString(newPosition.x, newPosition.y)];
    forEach(newPositionObservers || [], observerId => {
      if (observerId === entityId) return;

      const observerEntity = this.entities[observerId];
      const distance = getVectorDistance(newPosition, observerEntity.position);
      this.triggerEntryEvent(observerId, entityId, distance);
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
    const originEntity = this.entities[originEntityId];

    forEach(positions, position => {
      forEach(this.observationMap[position] || [], observerId => {
        if (originEntityId === observerId) return;

        const observerEntity = this.entities[observerId];
        const distance = getVectorDistance(originEntity.position, observerEntity.position);
        this.triggerEntryEvent(originEntityId, observerId, distance);
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
        forEach(this.callbacks[observerId][MapOpservatorEvent.ExitRange] || [], fn => fn(entityId));
      }
    }
  }

  private triggerEntryEvent(observerId: EntityID, entityId: EntityID, distance: number) {
    if (this.entitiesInSight[observerId] && this.entitiesInSight[observerId].includes(entityId)) return;

    this.entitiesInSight[observerId] ||= [];
    this.entitiesInSight[observerId] = [...this.entitiesInSight[observerId], entityId];

    if (this.callbacks[observerId]) {
      forEach(this.callbacks[observerId][MapOpservatorEvent.EnterRange] || [], fn => fn(entityId, distance));
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
