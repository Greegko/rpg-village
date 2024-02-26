import { AnyActivity } from "./activity";
import { IActivityHandler } from "./activity-handler";

export interface ActivityClass {
  new (...args: any[]): IActivityHandler<AnyActivity>;
}

export interface ModulActivity {
  activity: ActivityClass;
  name: string;
}
