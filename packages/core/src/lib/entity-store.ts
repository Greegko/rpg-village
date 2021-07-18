import { assoc, merge, dissoc, prop, omit } from 'ramda';
import { generate } from 'shortid';
import { IEntityStore, EntityStoreState, EntityUpdater } from '../models';
import { injectable } from 'inversify';

@injectable()
export class EntityStore<Entity extends { id: EntityID }, EntityID extends string = string> implements IEntityStore<Entity, EntityID> {
  private state: EntityStoreState<Entity, EntityID> = {};

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

  update(entityId: EntityID, entity: Partial<Entity>): void;
  update(entityId: EntityID, updater: EntityUpdater<Entity>): void;
  update(entityId: EntityID, entityOrUpdater: Partial<Entity> | EntityUpdater<Entity>): void {
    let entity: Partial<Entity> | null = null;

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
