import { Activity, IActivityHandler } from "../interfaces";

export interface ActivityClass {
  new (...args: any[]): IActivityHandler<Activity>;
}

export interface ModulActivity {
  activity: ActivityClass;
  name: string;
}

declare module "@core/module" {
  export interface Module {
    activities?: ModulActivity[];
  }
}
