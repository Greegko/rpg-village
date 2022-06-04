import { connect } from "react-redux";

import { GameStoreState, disableAI, enableAI, fastForward, logState, pause, reset, resume, save } from "../../../game";

import "./developer-toolbox.scss";

const storeDispatchers = { fastForward, save, reset, pause, resume, logState, disableAI, enableAI };

const mapProperty = (state: GameStoreState) => {
  return {
    isPaused: state.ui.paused,
    isAIEnabled: state.ui.ai,
  };
};

interface DeveloperToolboxActions {
  fastForward: typeof fastForward;
  save: typeof save;
  reset: typeof reset;
  pause: typeof pause;
  resume: typeof resume;
  logState: typeof logState;
  disableAI: typeof disableAI;
  enableAI: typeof enableAI;
}

interface DeveloperToolboxProperties {
  isPaused: boolean;
  isAIEnabled: boolean;
}

export const DeveloperToolbox = connect(
  mapProperty,
  storeDispatchers,
)(
  ({
    fastForward,
    save,
    reset,
    pause,
    isPaused,
    resume,
    logState,
    isAIEnabled,
    disableAI,
    enableAI,
  }: DeveloperToolboxProperties & DeveloperToolboxActions) => {
    return (
      <div className="developer-toolbox">
        <div>
          {isAIEnabled && <button onClick={() => disableAI()}>Turn AI off</button>}
          {!isAIEnabled && <button onClick={() => enableAI()}>Turn AI on</button>}
          {!isPaused && <button onClick={() => pause()}>Pause</button>}
          {isPaused && <button onClick={() => resume()}>Resume</button>}
          <button onClick={() => save()}>Save</button>
          <button onClick={() => reset()}>Reset</button>
          <button onClick={() => logState()}>Log State</button>
        </div>
        <div>
          Turn:
          <button onClick={() => fastForward(10)}>+10</button>
          <button onClick={() => fastForward(100)}>+100</button>
          <button onClick={() => fastForward(500)}>+500</button>
        </div>
      </div>
    );
  },
);
