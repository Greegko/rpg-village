import { inject, injectable } from "inversify";
import { EventHandler, EventSystem } from "@core/event";
import { Difficulty, GameEvent, IncreaseDifficultyEventArgs } from "./interfaces";
import { GameService } from "./game-service";

@injectable()
export class GameEventHandler implements EventHandler {
  constructor(
    @inject("GameService") private gameService: GameService
  ) {}

  init(eventSystem: EventSystem) {
    eventSystem.on(GameEvent.IncreaseDifficulty, (args: IncreaseDifficultyEventArgs) => this.increaseDifficulty(args.difficulty));
  }

  private increaseDifficulty(difficulty: Difficulty) {
    this.gameService.increaseDifficulty(difficulty);
  }
}
