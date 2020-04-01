export type EntityUpdater<T> = (entity: T) => Partial<T>;

export type EntityStoreState<Entity extends { id: EntityID }, EntityID extends string = string> = { [key: string]: Entity };
export interface IEntityStore<Entity extends { id: EntityID }, EntityID extends string = string> {
  getState(): EntityStoreState<Entity, EntityID>;
  init(state: EntityStoreState<Entity, EntityID>);
  get(id: EntityID): Entity;
  add(entity: Entity): Entity;
  update(entityId: EntityID, entity: Partial<Entity>): void;
  update(entityId: EntityID, updater: EntityUpdater<Entity>): void;
  remove(entityId: EntityID): void;
}
