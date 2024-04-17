import { AnyActivity } from "./activity";
import { ActivityHandler } from "./activity-handler";

interface ActivityHandlerClass {
  new (...args: any[]): ActivityHandler<AnyActivity>;
}

export interface ModulActivity {
  activity: ActivityHandlerClass;
  name: string;
}
