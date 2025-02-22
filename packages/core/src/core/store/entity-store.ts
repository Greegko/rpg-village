import { assoc, dissoc, merge, omit, prop } from "rambda";

import { generateId } from "@lib/generate-id";

export type EntityUpdaterCallback<T> = (entity: T) => Partial<T>;
export type EntityUpdater<T> = Partial<T> | EntityUpdaterCallback<T>;

export type EntityStoreState<EntityID extends string, Entity extends { id: EntityID }> = {
  [key: string]: Entity;
};

export function isEntityUpdaterCallback<T>(entityOrUpdater: EntityUpdater<T>): entityOrUpdater is EntityUpdaterCallback<T> {
  return typeof entityOrUpdater === "function";
}

export abstract class EntityStore<EntityID extends string, Entity extends { id: EntityID }> {
  private state: EntityStoreState<EntityID, Entity> = {};

  getState(): EntityStoreState<EntityID, Entity> {
    return this.state;
  }

  init(state: EntityStoreState<EntityID, Entity>) {
    this.state = merge(this.state, state);
  }

  get(id: EntityID): Entity {
    return prop(id, this.state);
  }

  add(entity: Omit<Entity, "id">): Entity {
    const id = generateId<EntityID>();
    const newObject = merge(entity, { id }) as Entity;
    this.state = assoc(id, newObject, this.state);
    return newObject as Entity;
  }

  update(entityId: EntityID, updater: EntityUpdaterCallback<Entity>): void;
  update(entityId: EntityID, entity: Partial<Entity>): void;
  update(entityId: EntityID, entityOrUpdater: EntityUpdater<Entity>): void {
    let entity: Partial<Entity> | null = null;

    if (isEntityUpdaterCallback(entityOrUpdater)) {
      entity = entityOrUpdater(this.get(entityId));
    } else {
      entity = entityOrUpdater;
    }

    const oldObject = prop(entityId, this.state);
    const newObject = merge(oldObject, omit(["id"], entity));
    this.state = assoc(entityId, newObject, this.state);
  }

  remove(entityId: EntityID): void {
    this.state = dissoc(entityId, this.state);
  }
}
