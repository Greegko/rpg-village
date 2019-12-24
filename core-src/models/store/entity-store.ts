export type WithID<Entity, ID = string> = Entity & { id: ID };

export type EntityStoreState<Entity, EntityID extends string = string> = { [key: string]: WithID<Entity, EntityID>  };
export interface IEntityStore<Entity, EntityID extends string = string> {
  getState(): EntityStoreState<Entity, EntityID>;
  init(state: EntityStoreState<Entity, EntityID>);
  get(id: EntityID): WithID<Entity, EntityID>;
  add(entity: Entity): Entity;
  update(entityId: EntityID, entity: Partial<Entity>): void;
  remove(entityId: EntityID): void;
}
