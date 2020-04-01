import * as React from 'react';
import { connect } from 'react-redux';
import { VillageCommand, VillageState } from '@rpg-village/core';
import { GameStoreState, executeCommand, villageSelector } from '../../game';

import './village.scss';

const propertyMapper = (state: GameStoreState) => ({ village: villageSelector(state) });
const dispatchers = { executeCommand };

interface VillageProperties {
  village: VillageState;
  executeCommand: typeof executeCommand;
}

export const Village = connect(propertyMapper, dispatchers)
  (
    ({ village, executeCommand }: VillageProperties) => (
      <div>
        <div className='house' onClick={() => executeCommand({ command: VillageCommand.BuildHouse })}>Houses lvl {village.houses}</div>
      </div>
    )
  );
