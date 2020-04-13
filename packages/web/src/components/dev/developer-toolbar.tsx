import * as React from 'react';
import { connect } from 'react-redux';
import { fastForward, save, reset, pause, resume, logState, GameStoreState } from '../../game';


const storeDispatchers = { fastForward, save, reset, pause, resume, logState };

const mapProperty = (state: GameStoreState) => {
  return {
    isPaused: state.ui.paused
  }
}

interface DeveloperToolbarProperties {
  fastForward: typeof fastForward;
  save: typeof save;
  reset: typeof reset;
  pause: typeof pause;
  resume: typeof resume;
  logState: typeof logState;
  isPaused: boolean;
}

import './developer-toolbar.scss';
export const DeveloperToolbar = connect(mapProperty, storeDispatchers)
  (
    ({ fastForward, save, reset, pause, isPaused, resume, logState }: DeveloperToolbarProperties) => {
      return (
        <div className='developer-toolbar'>
          <div>
            {isPaused && <button onClick={resume}>Resume</button>}
            {!isPaused && <button onClick={pause}>Pause</button>}
            <button onClick={save}>Save</button>
            <button onClick={reset}>Reset</button>
            <button onClick={logState}>Log State</button>
          </div>
          <div>
            Turn:
            <button onClick={() => fastForward(10)}>+10</button>
            <button onClick={() => fastForward(100)}>+100</button>
            <button onClick={() => fastForward(500)}>+500</button>
          </div>
        </div>
      );
    }
  );
