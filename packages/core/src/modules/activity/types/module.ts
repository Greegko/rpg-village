import { ModulActivity } from "../interfaces";

declare module "@core" {
  export interface Module {
    activities?: ModulActivity[];
  }
}
