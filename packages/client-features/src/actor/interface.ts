import { Observable } from "rxjs";

export type OnEventObservableFactory<Dependencies, Context> = (deps: Dependencies, context: Context) => Observable<any>;

export type Dependencies = { [key: string]: Function };

export type EventCallback<Dependencies, Context> = (deps: Dependencies, context: Context) => void;

export type ActionCallback<Dependencies, Context> = (d: Dependencies, c: Context) => void;

export type Actions<Keys extends string, Dependencies, Context> = {
  [key in Keys]?: ActionCallback<Dependencies, Context>;
};

export type EventListeners<Keys extends string, Dependencies, Context> = {
  [key in Keys]?: OnEventObservableFactory<Dependencies, Context>;
};

export interface ActorState<Events extends string, Dependencies, Context> {
  onEnter?: (deps: Dependencies, context: Context) => void;
  onEvent?: { [key in Events]?: EventCallback<Dependencies, Context> };
  onExit?: (deps: Dependencies, context: Context) => void;
}

export interface ActorRootState<Events extends string, Dependencies, Context> {
  initial: string;
  states: Record<string, ActorRootState<Events, Dependencies, Context> | ActorState<Events, Dependencies, Context>>;
}

export interface StateCreatorUtils<Actions extends string, Events extends string, Context> {
  executeAction: (actionName: Actions) => void;
  switchTo: (newState: string) => void;
  setContext: (updater: (currentContext: Context) => Context) => void;
  emitEvent: (event: Events) => void;
}

export interface Actor<Events, Context> {
  start(): void;
  end(): void;
  switchTo(newState: string): void;
  setContext(updater: (currentContext: Context) => Context): void;
  emitEvent(event: Events): void;
}

export type ActorFactory<Context, Actions, Events, Deps extends Dependencies> = (
  dependencies: Deps,
  actions: Actions,
  eventListeners: Events,
  context: Context,
) => Actor<keyof Events, Context>;
