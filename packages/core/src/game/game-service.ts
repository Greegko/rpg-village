import { inc } from "rambda";

import { inject, injectable } from "@lib/dependency-injection";

import { GeneralGameStore } from "./general-store";

@injectable()
export class GameService {
  private generalGameStore = inject(GeneralGameStore);

  increaseTurn() {
    this.generalGameStore.update("turn", inc);
  }
}
