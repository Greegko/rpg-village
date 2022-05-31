import { injectable } from "inversify";
import { inc } from "ramda";
import { GeneralGameStore } from "./general-store";

@injectable()
export class GameService {
  constructor(private generalGameStore: GeneralGameStore) {}

  increaseTurn() {
    this.generalGameStore.update("turn", inc);
  }
}
