import { EntityStore } from "./entity-store";
import { KeyValueStore } from "./key-value-store";
import { ObjectStore } from "./object-store";

export type Store = ObjectStore<any> | EntityStore<any, any> | KeyValueStore<any, any>;
