import { IStore } from "@core/store";
import { IActivityHandler } from "@modules/activity";

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

export interface ActivityClass {
  new (...args: any[]): IActivityHandler<any, any>;
}

export interface ModulActivity {
  activity: ActivityClass;
  name: string;
}

export interface ModulStore {
  scope: string;
  store: StoreClass;
  initialState?: object;
}

export interface Module {
  activities?: ModulActivity[];
  stores?: ModulStore[];
  provides?: (ProvideClass | ProvideValue)[];
}
