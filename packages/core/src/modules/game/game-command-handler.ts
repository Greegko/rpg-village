import { inject, injectable } from 'inversify';
import { CommandSystem } from "../../lib/command-system";
import { ActivityManager } from '../activity';
import { GameCommand } from './interfaces';
import { GameService } from './game-service';

@injectable()
export class GameCommandHandler {
  constructor(
    @inject('GameService') private gameService: GameService,
    @inject('ActivityManager') private activityManager: ActivityManager,
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(GameCommand.TurnCommand, () => this.turn());
  }

  private turn() {
    this.gameService.increaseTurn();
    this.activityManager.runActivites();
  }
}
