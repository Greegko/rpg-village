import { IObjectStore } from "./object-store";
import { IEntityStore } from "./entity-store";

export * from "./entity-store";
export * from "./object-store";

export type IStore = IObjectStore<any> | IEntityStore<any, any>;
