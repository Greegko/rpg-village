import * as React from 'react';
import { connect } from 'react-redux';
import { VillageCommand, VillageState } from '@rpg-village/core';
import { GameStoreState, executeCommand, villageSelector } from '../../game';

const propertyMapper = (state: GameStoreState) => ({ village: villageSelector(state.game) });
const dispatchers = { executeCommand };

interface VillageProperties {
  village: VillageState;
  executeCommand: typeof executeCommand;
}

import './village.scss';
export const Village = connect(propertyMapper, dispatchers)
  (
    ({ village, executeCommand }: VillageProperties) => (
      <div>
        <div className='house' onClick={() => executeCommand({ command: VillageCommand.BuildHouse })}>Houses lvl {village.houses}</div>
      </div>
    )
  );
