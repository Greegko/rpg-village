import { injectable } from "inversify";
import { assoc, dissoc, merge, mergeAll, omit, prop } from "rambda";
import { generate } from "shortid";

export type EntityUpdater<T> = (entity: T) => Partial<T>;

export type EntityStoreState<EntityID extends string, Entity extends { id: EntityID }> = {
  [key: string]: Entity;
};

export interface IEntityStore<EntityID extends string, Entity extends { id: EntityID }> {
  getState(): EntityStoreState<EntityID, Entity>;
  init(state: EntityStoreState<EntityID, Entity>): void;
  get(id: EntityID): Entity;
  add(entity: Omit<Entity, "id">): Entity;
  update(entityId: EntityID, entity: Partial<Entity>): void;
  update(entityId: EntityID, updater: EntityUpdater<Entity>): void;
  remove(entityId: EntityID): void;
}

@injectable()
export class EntityStore<EntityID extends string, Entity extends { id: EntityID }>
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
    const id = generate();
    const newObject = assoc("id", id, entity) as T;
    this.state = assoc(id, newObject, this.state);
    return newObject;
  }

  update(entityId: EntityID, entity: Partial<Entity>): void;
  update(entityId: EntityID, updater: EntityUpdater<Entity>): void;
  update(entityId: EntityID, entityOrUpdater: Partial<Entity> | EntityUpdater<Entity>): void {
    let entity: Partial<Entity> | null = null;

    if (typeof entityOrUpdater === "function") {
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
