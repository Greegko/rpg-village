import { IStore, ModuleConfig } from "@core";

export interface ProvideClass {
  new (...args: any[]): any;
}

export interface ProvideValue {
  provide: string;
  value: any;
}

export interface StoreClass {
  new (...args: any[]): IStore;
}

export interface ModulStore {
  scope: string;
  store: StoreClass;
  initialState?: object;
}

export interface Module {
  stores?: ModulStore[];
  provides?: (ProvideClass | ProvideValue)[];
  defaultConfig?: ModuleConfig;
}
