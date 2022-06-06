import { createMiddlewareAction } from "../../action-middleware-factory";
import { executeCommand, fastForward, logState, reset, save } from "./reducers";

export const gameCommandsActions = [
  createMiddlewareAction(fastForward, (action, context) => {
    context.gameInstance.fastForward(action.payload);
  }),
  createMiddlewareAction(executeCommand, (action, context) => {
    context.gameInstance.executeCommand(action.payload);
  }),
  createMiddlewareAction(save, (action, context) => {
    context.gameInstance.localSave();
  }),
  createMiddlewareAction(logState, (action, context) => {
    console.log(context.gameInstance.getState());
  }),
  createMiddlewareAction(reset, (action, context) => {
    context.gameInstance.localReset();
    window.location.reload();
  }),
];
