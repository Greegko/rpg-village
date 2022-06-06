import { useDispatch } from "react-redux";

import { fastForward, logState, reset, save } from "../../../game/store/game-command";
import {
  disableAI,
  enableAI,
  isAIEnabledSelector,
  pause,
  pausedSelector,
  resume,
  useGameUISelector,
} from "../../../game/store/game-ui";

import "./developer-toolbox.scss";

export const DeveloperToolbox = () => {
  const isAIEnabled = useGameUISelector(isAIEnabledSelector);
  const isPaused = useGameUISelector(pausedSelector);
  const dispatch = useDispatch();

  return (
    <div className="developer-toolbox">
      <div>
        {isAIEnabled && <button onClick={() => dispatch(disableAI())}>Turn AI off</button>}
        {!isAIEnabled && <button onClick={() => dispatch(enableAI())}>Turn AI on</button>}
        {!isPaused && <button onClick={() => dispatch(pause())}>Pause</button>}
        {isPaused && <button onClick={() => dispatch(resume())}>Resume</button>}
        <button onClick={() => dispatch(save())}>Save</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
        <button onClick={() => dispatch(logState())}>Log State</button>
      </div>
      <div>
        Turn:
        <button onClick={() => dispatch(fastForward(10))}>+10</button>
        <button onClick={() => dispatch(fastForward(100))}>+100</button>
        <button onClick={() => dispatch(fastForward(500))}>+500</button>
      </div>
    </div>
  );
};
