import { assoc, merge, dissoc, prop, omit, assocPath } from 'ramda';
import { generate } from 'shortid';
import { IEntityStore, EntityStoreState, EntityUpdater } from '../models';
import { injectable } from 'inversify';

@injectable()
export class EntityStore<Entity extends { id: EntityID }, EntityID extends string = string> implements IEntityStore<Entity, EntityID> {
  private state: EntityStoreState<Entity, EntityID>;

  getState(): EntityStoreState<Entity, EntityID> {
    return this.state;
  }

  init(state: EntityStoreState<Entity, EntityID>) {
    this.state = state;
  }

  get(id: EntityID): Entity {
    return prop(id, this.state);
  }

  add(entity: Omit<Entity, 'id'>): Entity {
    const id = generate();
    const newObject = assoc('id', id, entity) as Entity;
    this.state = assoc(id, newObject, this.state);
    return newObject;
  }

  set(entityId: EntityID, entity: Partial<Entity>): void;
  set(entityId: EntityID, updater: EntityUpdater<Entity>): void;
  set(entityId: EntityID, entityOrUpdater: Partial<Entity> | EntityUpdater<Entity>): void {
    let entity: Partial<Entity> = null;

    if (typeof entityOrUpdater === 'function') {
      entity = entityOrUpdater(this.get(entityId));
    } else {
      entity = entityOrUpdater;
    }

    this.state = assoc(entityId, entity, this.state);
  }

  setPath<P1 extends keyof NonNullable<Entity>, V extends NonNullable<Entity>[P1]>(entityId: EntityID, path: [P1], value: V): void;
  setPath<P1 extends keyof NonNullable<Entity>, P2 extends keyof NonNullable<NonNullable<Entity>[P1]>, V extends NonNullable<NonNullable<Entity>[P1]>[P2]>(entityId: EntityID, path: [P1, P2], value: V): void;
  setPath(entityId: EntityID, propertyPath: string[], entityPathValue: any) {
    this.state = assocPath([entityId, ...propertyPath], entityPathValue, this.state);
  }

  update(entityId: EntityID, entity: Partial<Entity>): void;
  update(entityId: EntityID, updater: EntityUpdater<Entity>): void;
  update(entityId: EntityID, entityOrUpdater: Partial<Entity> | EntityUpdater<Entity>): void {
    let entity: Partial<Entity> = null;

    if (typeof entityOrUpdater === 'function') {
      entity = entityOrUpdater(this.get(entityId));
    } else {
      entity = entityOrUpdater;
    }

    const oldObject = prop(entityId, this.state);
    const newObject = merge(oldObject, omit(['id'], entity));
    this.state = assoc(entityId, newObject, this.state);
  }

  remove(entityId: EntityID): void {
    this.state = dissoc(entityId, this.state);
  }
}
