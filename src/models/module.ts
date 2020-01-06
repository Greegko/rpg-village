import { IStore } from "./store";
import { EventHandler } from './event';
import { IActivityHandler } from "../modules/activity/interfaces";

export interface ProvideClass { new(...args): any; }
export interface ProvideValue { provide: string; value: any }
export interface StoreClass { new(...args): IStore; }
export interface ActivityClass { new(...args): IActivityHandler<any, any>; }
export interface EventHandlerClass { new(...args): EventHandler; }

export interface ModulActivity {
  activity: ActivityClass;
  type: string;
}

export interface ModulStore {
  store?: StoreClass;
  initialState?: object;
  scope: string;
}

export interface ModuleEventHandler {
  eventHandler: EventHandlerClass;
}

export interface Module {
  eventHandlers?: ModuleEventHandler[];
  activities?: ModulActivity[];
  stores?: ModulStore[];
  provides?: (ProvideClass | ProvideValue)[];
}
