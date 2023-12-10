import { Action, Middleware } from "@reduxjs/toolkit";

export const globalStoreActions: Record<string, Function> = {};
export const globalStoreActionsMiddleware: Middleware = () => next => action => {
  const { type, payload } = action as Action & { payload: any };

  let result = next(action);

  if (globalStoreActions[type]) globalStoreActions[type](payload);

  return result;
};

export const onStoreAction = (action: Action, callback: Function) => {
  globalStoreActions[action.type] = callback;
};
