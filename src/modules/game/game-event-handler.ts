import { inject, injectable } from 'inversify';
import { EventSystem } from "../../lib/event-system";
import { ActivityHandler } from '../activity';
import { GameEvents } from './interfaces';
import { GameService } from './game-service';

@injectable()
export class GameEventHandler {

  constructor(
    @inject('GameService') private gameService: GameService,
    @inject('ActivityHandler') private activityHandler: ActivityHandler,
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(GameEvents.TurnEvent, () => this._turn());
  }

  private _turn() {
    this.gameService.increaseTurn();
    this.activityHandler.runActivites();
  }
}
