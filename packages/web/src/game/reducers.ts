import { GameState, Command } from "@rpg-village/core";
import { GameUI, GameScreen } from "./interface";
import { GameInstanceWrapper } from "./game-instance-wrapper";

// GAME MISC REDUCER

enum GameInstanceAction {
  FastForward = 'game-misc/fast-forward',
  PlayerCommand = 'game-misc/command',
  Save = 'game-misc/save',
  Reset = 'game-misc/reset',
  LogState = 'game-misc/log-state'
}

export function fastForward(turns: number) {
  return {
    type: GameInstanceAction.FastForward,
    turns
  }
}

export function save() {
  return {
    type: GameInstanceAction.Save
  }
}

export function logState() {
  return {
    type: GameInstanceAction.LogState
  }
}

export function reset() {
  return {
    type: GameInstanceAction.Reset
  }
}

export const executeCommand = (command: Command) => {
  return {
    type: GameInstanceAction.PlayerCommand,
    command
  }
}

export function gameMiscActionReducerFactory(gameWrapper: GameInstanceWrapper) {
  return (action) => {
    switch (action.type) {
      case GameInstanceAction.FastForward:
        setTimeout(() => gameWrapper.fastForward(action.turns));
        return;
      case GameInstanceAction.PlayerCommand:
        setTimeout(() => gameWrapper.executeCommand(action.command));
        return;
      case GameInstanceAction.Save:
        setTimeout(() => gameWrapper.localSave());
        return;
      case GameInstanceAction.LogState:
        console.log(gameWrapper.getState());
        return;
      case GameInstanceAction.Reset:
        setTimeout(() => {
          gameWrapper.localReset();
          window.location.reload();
        });
        return;
      case GameUIAction.EnableAI:
        setTimeout(() => gameWrapper.enableAI(true));
        return;
      case GameUIAction.DisableAI:
        setTimeout(() => gameWrapper.enableAI(false));
        return;
      case GameUIAction.Pause:
        setTimeout(() => gameWrapper.pause());
        return;
      case GameUIAction.Resume:
        setTimeout(() => gameWrapper.resume());
        return;
    }
  }
}



// GAME REDUCER

enum GameAction { SetState = 'game/set-state' };

export const updateGameState = (state: GameState) => {
  return {
    type: GameAction.SetState,
    state
  }
}

export function gameReducer(state: GameState = {} as any, action) {
  switch (action.type) {
    case GameAction.SetState:
      return action.state;
    default:
      return state;
  }
}

// GAME UI REDUCER

enum GameUIAction {
  ChangeScreen = 'ui/change-screen',
  Pause = 'ui/pause',
  Resume = 'ui/resume',
  EnableAI = 'ui/ai-enable',
  DisableAI = 'ui/ai-disable'
};

export const setScreen = (screen: GameScreen) => {
  return {
    type: GameUIAction.ChangeScreen,
    state: screen
  }
}

export const enableAI = () => {
  return {
    type: GameUIAction.EnableAI
  }
}

export const disableAI = () => {
  return {
    type: GameUIAction.DisableAI
  }
}

export const pause = () => {
  return {
    type: GameUIAction.Pause
  }
}

export const resume = () => {
  return {
    type: GameUIAction.Resume
  }
}

export function gameUIReducer(state: GameUI = {} as any, action) {
  switch (action.type) {
    case GameUIAction.ChangeScreen:
      return { ...state, activeScreen: action.screen };
    case GameUIAction.Pause:
      return { ...state, paused: true };
    case GameUIAction.Resume:
      return { ...state, paused: false };
    case GameUIAction.EnableAI:
      return { ...state, ai: true };
    case GameUIAction.DisableAI:
      return { ...state, ai: false };
    default:
      return state;
  }
}
