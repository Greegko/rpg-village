import { inject, injectable } from 'inversify';
import { CommandSystem } from "../../lib/command-system";
import { ActivityHandler } from '../activity';
import { GameCommand } from './interfaces';
import { GameService } from './game-service';

@injectable()
export class GameCommandHandler {

  constructor(
    @inject('GameService') private gameService: GameService,
    @inject('ActivityHandler') private activityHandler: ActivityHandler,
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(GameCommand.TurnCommand, () => this._turn());
  }

  private _turn() {
    this.gameService.increaseTurn();
    this.activityHandler.runActivites();
  }
}
