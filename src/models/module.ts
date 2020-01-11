import { IStore } from "./store";
import { CommandHandler } from './command-handler';
import { IActivityHandler } from "../modules/activity/interfaces";

export interface ProvideClass { new(...args): any; }
export interface ProvideValue { provide: string; value: any }
export interface StoreClass { new(...args): IStore; }
export interface ActivityClass { new(...args): IActivityHandler<any, any>; }
export interface CommandHandlerClass { new(...args): CommandHandler; }

export interface ModulActivity {
  activity: ActivityClass;
  type: string;
}

export interface ModulStore {
  store?: StoreClass;
  initialState?: object;
  scope: string;
}

export interface Module {
  commandHandlers?: CommandHandlerClass[];
  activities?: ModulActivity[];
  stores?: ModulStore[];
  provides?: (ProvideClass | ProvideValue)[];
}
