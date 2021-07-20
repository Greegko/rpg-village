import { IStore } from "@core/store";
import { CommandHandler } from "@core/command";
import { EventHandler } from "@core/event";
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
export interface CommandHandlerClass {
  new (...args: any[]): CommandHandler;
}
export interface EventHandlerClass {
  new (...args: any[]): EventHandler;
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
  eventHandler?: EventHandlerClass;
  commandHandler?: CommandHandlerClass;
  activities?: ModulActivity[];
  stores?: ModulStore[];
  provides?: (ProvideClass | ProvideValue)[];
}
