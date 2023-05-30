import { Unit, UnitID } from "../interfaces";

declare module "@core" {
  interface GameState {
    units: Record<UnitID, Unit>;
  }
}
