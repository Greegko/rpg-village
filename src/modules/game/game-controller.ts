import { inject, multiInject, injectable } from 'inversify';
import { GameState } from './interfaces';
import { GameStore } from './game-store';
import { Event, EventHandler } from "../../models";
import { EventSystem } from "../../lib/event-system";
import { CommandStore, Command } from '../command';
import { GameEvents } from './interfaces';

@injectable()
export class GameController<State extends GameState> {

  constructor(
    @inject('GameStore') private gameStore: GameStore<State>,
    @inject('CommandStore') private commandStore: CommandStore,
    @inject('EventSystem') private eventSystem: EventSystem,
    @multiInject('eventHandlers') eventHandlers: EventHandler[]
  ) {
    eventSystem.hookEventHandlers(eventHandlers);
  }

  gameTurn() {
    this.eventSystem.fire(GameEvents.TurnEvent);
    return this.gameStore.getState();
  }

  loadGame(gameState: State): State {
    this.gameStore.init(gameState);
    return this.gameStore.getState();
  }

  startNewGame(): State {
    this.gameStore.init({} as any);
    this.eventSystem.fire(GameEvents.NewGame);
    return this.gameStore.getState();
  }

  fireEvent({ event, args }: Event): State {
    this.eventSystem.fire(event, args);

    return this.gameStore.getState();
  }

  commandParty(command: Command) {
    this.commandStore.add(command);
  }

}
