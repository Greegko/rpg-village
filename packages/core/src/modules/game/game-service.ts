import { injectable, inject } from "inversify";
import { inc, add } from "ramda";
import { GeneralGameStore } from "./general-store";

@injectable()
export class GameService {
  constructor(@inject("GeneralGameStore") private generalGameStore: GeneralGameStore) {}

  increaseTurn() {
    this.generalGameStore.update("turn", inc);
  }

  increaseDifficulty(difficulty: number) {
    this.generalGameStore.update("difficulty", add(difficulty));
  }
}
