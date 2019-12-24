import { assoc, merge, dissoc, prop, omit } from 'ramda';
import { generate } from 'shortid';
import { IEntityStore, WithID, EntityStoreState } from '../models';
import { injectable } from 'inversify';

@injectable()
export class EntityStore<Entity, EntityID extends string = string> implements IEntityStore<Entity, EntityID> {
  private state: EntityStoreState<Entity, EntityID>;

  getState(): EntityStoreState<Entity, EntityID> {
    return this.state;
  }

  init(state: EntityStoreState<Entity, EntityID>) {
    this.state = state;
  }

  get(id: EntityID): WithID<Entity, EntityID> {
    return prop(id, this.state);
  }

  add(entity: Entity): WithID<Entity> {
    const id = generate();
    const newObject = assoc('id', id, entity);
    this.state = assoc(id, newObject, this.state);
    return newObject;
  }

  update(entityId: EntityID, entity: Partial<Entity>): void {
    const oldObject = prop(entityId, this.state);
    const newObject = merge(oldObject, omit(['id'], entity));
    this.state = assoc(entityId, newObject, this.state);
  }

  remove(entityId: EntityID): void {
    this.state = dissoc(entityId, this.state);
  }
}
