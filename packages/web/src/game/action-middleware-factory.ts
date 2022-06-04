import { Action, PayloadAction, createListenerMiddleware } from "@reduxjs/toolkit";

export type MiddlewareActionFunction<T> = T extends undefined
  ? (state: any) => void
  : (state: any, action?: PayloadAction<T>) => void;

export const NOOP_ACTION: MiddlewareActionFunction<undefined> = (state: any) => {};

export type MiddlewareAction<T extends string, C> = [Action<T>, (action: T, context: C) => void];

export type MiddlewareActionCallback<C> = (actions: any, context: C) => void;
export const createMiddlewareAction = <T, C = any>(
  action: T,
  callback: MiddlewareActionCallback<C>,
): [T, MiddlewareActionCallback<C>] => {
  return [action, callback];
};

export function createActionMiddlwareFactory<C>(context: C) {
  return (actions: MiddlewareAction<any, C>[]) => {
    const middleware = createListenerMiddleware();

    for (let [actionCreator, effect] of actions) {
      middleware.startListening({ actionCreator: actionCreator as any, effect: action => effect(action, context) });
    }

    return middleware;
  };
}
