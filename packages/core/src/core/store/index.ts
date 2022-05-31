import { IEntityStore } from "./entity-store";
import { IObjectStore } from "./object-store";

export * from "./entity-store";
export * from "./object-store";

export type IStore = IObjectStore<any> | IEntityStore<any, any>;
