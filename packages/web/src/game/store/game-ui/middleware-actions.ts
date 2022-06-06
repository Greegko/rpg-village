import { createMiddlewareAction } from "../../action-middleware-factory";
import { disableAI, enableAI, pause, resume } from "./reducers";

export const gameUIactions = [
  createMiddlewareAction(pause, (action, context) => {
    context.gameInstance.pause();
  }),
  createMiddlewareAction(resume, (action, context) => {
    context.gameInstance.resume();
  }),
  createMiddlewareAction(enableAI, (action, context) => {
    context.gameInstance.enableAI(true);
  }),
  createMiddlewareAction(disableAI, (action, context) => {
    context.gameInstance.enableAI(false);
  }),
];
