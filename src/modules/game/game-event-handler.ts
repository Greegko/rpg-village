import { inject, injectable } from 'inversify';
import { EventSystem } from '@greegko/rpg-model';
import { ActivityHandler } from '../activity';
import { CommandHandler } from '../command';
import { GameEvents } from './interfaces';
import { GameService } from './game-service';

@injectable()
export class GameEventHandler {

  constructor(
    @inject('GameService') private gameService: GameService,
    @inject('ActivityHandler') private activityHandler: ActivityHandler,
    @inject('CommandHandler') private commandHandler: CommandHandler
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(GameEvents.TurnEvent, () => this._turn());
    eventSystem.on(GameEvents.FastForward, ({ turns }) => {
      for (let i = 0; i < turns; i++) {
        eventSystem.fire(GameEvents.TurnEvent);
      }
    });
  }

  private _turn() {
    this.gameService.increaseTurn();
    this.activityHandler.runActivites();
    this.commandHandler.executeCommands();
  }
}
