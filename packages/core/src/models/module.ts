import { IStore } from "./store";
import { CommandHandler } from './command-handler';
import { EventHandler } from './event-handler';
import { IActivityHandler } from "../modules/activity/interfaces";

export interface ProvideClass { new(...args): any; }
export interface ProvideValue { provide: string; value: any }
export interface StoreClass { new(...args): IStore; }
export interface ActivityClass { new(...args): IActivityHandler<any, any>; }
export interface CommandHandlerClass { new(...args): CommandHandler; }
export interface EventHandlerClass { new(...args): EventHandler; }

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
  eventHandler?: EventHandlerClass;
  commandHandler?: CommandHandlerClass;
  activities?: ModulActivity[];
  stores?: ModulStore[];
  provides?: (ProvideClass | ProvideValue)[];
}
