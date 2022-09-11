import { Middleware } from "@reduxjs/toolkit";

export const globalStoreActions: Record<string, Function> = {};
export const globalStoreActionsMiddleware: Middleware = store => next => action => {
  let result = next(action);

  if (globalStoreActions[action.type]) globalStoreActions[action.type]();

  return result;
};

export const onStoreAction = (action: any, callback: Function) => {
  globalStoreActions[action.type] = callback;
};
