import { Observable, Subject, Subscription, filter } from "rxjs";

type OnEventObservableFactory<Dependencies, Context> = (deps: Dependencies, context: Context) => Observable<any>;

type Dependencies = { [key: string]: Function };

type EventCallback<Dependencies, Context> = (deps: Dependencies, context: Context) => void;

type ActionCallback<Dependencies, Context> = (d: Dependencies, c: Context) => void;

type Actions<Keys extends string, Dependencies, Context> = {
  [key in Keys]?: ActionCallback<Dependencies, Context>;
};

type EventListeners<Keys extends string, Dependencies, Context> = {
  [key in Keys]?: OnEventObservableFactory<Dependencies, Context>;
};

interface ActorState<Events extends string, Dependencies, Context> {
  onEnter?: (deps: Dependencies, context: Context) => void;
  onEvent?: { [key in Events]?: EventCallback<Dependencies, Context> };
  onExit?: (deps: Dependencies, context: Context) => void;
}

interface ActorRootState<Events extends string, Dependencies, Context> {
  initial: string;
  states: Record<string, ActorRootState<Events, Dependencies, Context> | ActorState<Events, Dependencies, Context>>;
}

interface StateCreatorUtils<Actions extends string, Events extends string, Context> {
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

export const createActorFactory = <
  Context,
  ActionNames extends string,
  Deps extends Dependencies,
  Events extends string,
>(
  stateCreator: (utils: StateCreatorUtils<ActionNames, Events, Context>) => ActorRootState<Events, Deps, Context>,
): ActorFactory<Context, Actions<ActionNames, Deps, Context>, EventListeners<Events, Deps, Context>, Deps> => {
  return (
    dependencies: Deps,
    actions: Actions<ActionNames, Deps, Context>,
    eventListeners: EventListeners<Events, Deps, Context>,
    context: Context,
  ) => {
    const eventSystem = new Subject<Events>();

    const actorRootState = stateCreator({ switchTo, setContext, emitEvent, executeAction });

    let activeStateKeys: string[] = [];
    let activeSubscriptions = [] as Subscription[];

    function executeAction(actionName: ActionNames) {
      actions[actionName]?.(dependencies, context);
    }

    function getMainState() {
      const [mainState] = activeStateKeys;
      return actorRootState.states[mainState];
    }

    function getActiveState() {
      const [mainState, subState] = activeStateKeys;

      if (subState) {
        return (actorRootState.states[mainState] as ActorRootState<Events, Deps, Context>).states[subState];
      } else {
        return actorRootState.states[mainState];
      }
    }

    function switchTo(targetState: string) {
      diposeActiveState();
      setActiveState(targetState);
    }

    function setContext(updater: (currentContext: Context) => Context) {
      context = updater(context);
    }

    function emitEvent(event: Events) {
      eventSystem.next(event);
    }

    function diposeActiveState() {
      const activeState = getActiveState();

      for (let subscription of activeSubscriptions) {
        subscription.unsubscribe();
      }

      if ("onExit" in activeState && activeState.onExit) {
        activeState.onExit(dependencies, context);
      }
    }

    function setActiveState(target: string) {
      const activeMainState = getMainState();

      if (activeMainState && "states" in activeMainState && activeMainState.states[target]) {
        activeStateKeys = [activeStateKeys[0], target];
      } else {
        activeStateKeys = [target];
      }

      const activeState = getActiveState();

      if ("initial" in activeState) {
        return setActiveState(activeState.initial);
      }

      if ("onEvent" in activeState && activeState.onEvent) {
        for (let [eventName, eventCallback] of Object.entries(activeState.onEvent) as [
          Events,
          EventCallback<Dependencies, Context>,
        ][]) {
          activeSubscriptions.push(
            eventSystem.pipe(filter(val => val === eventName)).subscribe(() => eventCallback(dependencies, context)),
          );

          const eventFn = eventListeners[eventName];

          if (eventFn) {
            activeSubscriptions.push(
              eventFn(dependencies, context).subscribe(() => eventCallback(dependencies, context)),
            );
          }
        }
      }

      if ("onEnter" in activeState && activeState.onEnter) {
        activeState.onEnter(dependencies, context);
      }
    }

    function end() {
      diposeActiveState();
    }

    function start() {
      setActiveState(actorRootState.initial);
    }

    return { start, end, switchTo, setContext, emitEvent };
  };
};
