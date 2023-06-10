import { Activity } from "./activity";
import { IActivityHandler } from "./activity-handler";

export interface ActivityClass {
  new (...args: any[]): IActivityHandler<Activity>;
}

export interface ModulActivity {
  activity: ActivityClass;
  name: string;
}
