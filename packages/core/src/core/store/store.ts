import { EntityStore } from "./entity-store";
import { ObjectStore } from "./object-store";

export type Store = ObjectStore<any> | EntityStore<any, any>;
