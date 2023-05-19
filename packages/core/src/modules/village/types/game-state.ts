import { VillageState } from "../interfaces";

declare module "@core" {
  export interface GameState {
    village: VillageState;
  }
}
