import { Fraction, FractionID } from "../interface";

declare module "@rpg-village/core/extend" {
  interface GameState {
    fractions: Record<FractionID, Fraction>;
  }
}
