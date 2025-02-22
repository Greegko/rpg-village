import { EventSystem, commandHandler } from "@core";
import { inject, injectable } from "@lib/dependency-injection";

import { GameService } from "./game-service";
import { GameCommand, GameEvent } from "./interfaces";

@injectable()
export class GameCommandHandler {
  private gameService = inject(GameService);
  private eventSystem = inject(EventSystem);

  @commandHandler(GameCommand.TurnCommand)
  turn() {
    this.gameService.increaseTurn();
    this.eventSystem.fire(GameEvent.Turn);
  }
}
