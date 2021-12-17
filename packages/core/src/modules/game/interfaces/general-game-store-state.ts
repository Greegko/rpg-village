import { Turn } from "./turn";
import { Difficulty } from "./difficulty";

export interface GeneralGameStoreState {
  turn: Turn;
  difficulty: Difficulty;
}
