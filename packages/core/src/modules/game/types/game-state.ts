import { GeneralGameStoreState } from "../interfaces";

declare module "@core" {
  export interface GameState {
    general: GeneralGameStoreState;
  }
}
