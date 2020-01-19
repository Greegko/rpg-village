import { inject, injectable } from 'inversify';
import { CommandSystem } from "../../lib/command-system";
import { ActivityManager } from '../activity';
import { GameCommand, FastForwardCommandArgs } from './interfaces';
import { GameService } from './game-service';

@injectable()
export class GameCommandHandler {
  constructor(
    @inject('GameService') private gameService: GameService,
    @inject('ActivityManager') private activityManager: ActivityManager,
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(GameCommand.TurnCommand, () => this.turn());
    commandSystem.on(GameCommand.FastForward, ({ turns }: FastForwardCommandArgs) => {
      for (let i = 0; i < turns; i++) {
        this.turn();
      }
    });
  }

  private turn() {
    this.gameService.increaseTurn();
    this.activityManager.runActivites();
  }
}
