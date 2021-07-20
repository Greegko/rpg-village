import { injectable, inject } from "inversify";
import { GeneralGameStore } from "./general-store";

@injectable()
export class GameService {
  constructor(@inject("GeneralGameStore") private generalGameStore: GeneralGameStore) {}

  increaseTurn() {
    const turn = this.generalGameStore.get("turn");
    this.generalGameStore.set("turn", turn + 1);
  }
}
