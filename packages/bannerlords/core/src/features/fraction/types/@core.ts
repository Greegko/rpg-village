import { Fraction, FractionID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    fractions: Record<FractionID, Fraction>;
  }
}
