import { ModulActivity } from "../interfaces";

declare module "@core/module" {
  export interface Module {
    activities?: ModulActivity[];
  }
}
