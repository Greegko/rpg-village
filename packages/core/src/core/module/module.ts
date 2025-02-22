import { Store } from "../store";
import { ModuleConfig } from "./module-config";

export interface ProvideClass {
  new (...args: any[]): any;
}

export interface ProvideValue {
  provide: string;
  value: any;
}

export interface StoreClass {
  new (...args: any[]): Store;
}

export interface ModulStore {
  scope: string;
  store: StoreClass;
  initialState?: object;
}

declare module "@rpg-village/core/extend" {
  interface Module {
    stores?: ModulStore[];
    provides?: (ProvideClass | ProvideValue)[];
    defaultConfig?: ModuleConfig;
  }
}
