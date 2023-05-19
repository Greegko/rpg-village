import { OptionID, OptionState } from "../interfaces";

declare module "@core" {
  export interface GameState {
    options: Record<OptionID, OptionState>;
  }
}
