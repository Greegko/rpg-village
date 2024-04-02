import { injectable } from "inversify";
import { assoc, dissoc, merge, mergeAll, omit, prop } from "rambda";

import { generateId } from "@lib/generate-id";

export type EntityUpdaterCallback<T> = (entity: T) => Partial<T>;
export type EntityUpdater<T> = Partial<T> | EntityUpdaterCallback<T>;

export type EntityStoreState<EntityID extends string, Entity extends { id: EntityID }> = {
  [key: string]: Entity;
};

export function isEntityUpdaterCallback<T>(
  entityOrUpdater: EntityUpdater<T>,
): entityOrUpdater is EntityUpdaterCallback<T> {
  return typeof entityOrUpdater === "function";
}

export interface IEntityStore<EntityID extends string, Entity extends { id: EntityID }> {
  getState(): EntityStoreState<EntityID, Entity>;
  init(state: EntityStoreState<EntityID, Entity>): void;
  get(id: EntityID): Entity;
  add(entity: Omit<Entity, "id">): Entity;
  update(entityId: EntityID, entity: Partial<Entity>): void;
  update(entityId: EntityID, updater: EntityUpdaterCallback<Entity>): void;
  remove(entityId: EntityID): void;
}

@injectable()
export class EntityStore<EntityID extends string & { __typeGuard: string }, Entity extends { id: EntityID }>
  implements IEntityStore<EntityID, Entity>
{
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

  add<T extends Entity>(entity: Omit<T, "id">): T {
    const id = generateId<EntityID>();
    const newObject = assoc("id", id, entity) as T;
    this.state = assoc(id, newObject, this.state);
    return newObject;
  }

  update(entityId: EntityID, entity: Partial<Entity>): void;
  update(entityId: EntityID, updater: EntityUpdaterCallback<Entity>): void;
  update(entityId: EntityID, entityOrUpdater: EntityUpdater<Entity>): void {
    let entity: Partial<Entity> | null = null;

    if (isEntityUpdaterCallback(entityOrUpdater)) {
      entity = entityOrUpdater(this.get(entityId));
    } else {
      entity = entityOrUpdater;
    }

    const oldObject = prop(entityId, this.state);
    const newObject = mergeAll([oldObject, omit(["id"], entity)]);
    this.state = assoc(entityId, newObject, this.state);
  }

  remove(entityId: EntityID): void {
    this.state = dissoc(entityId, this.state);
  }
}
