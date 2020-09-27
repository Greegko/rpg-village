import * as React from 'react';
import { connect } from 'react-redux';
import { VillageState, GeneralGameStoreState } from '@rpg-village/core';
import { GameStoreState, executeCommand } from '../game';

const propertyMapper = (state: GameStoreState) => {
  return {
    village: state.game.village,
    general: state.game.general
  }
}

const dispatchers = { executeCommand }


interface VillageStatsProperties {
  village: VillageState;
  general: GeneralGameStoreState;
}

import './villagestats.scss';
export const VillageStats = connect(propertyMapper, dispatchers)
  (
    ({ village, general }: VillageStatsProperties) => (
      <div className="villagestats">
        <ul className='villagestats__list'>
          <li className="villagestats__list-item">
            Turn: {general.turn}
          </li>
          <li className="villagestats__list-item">
            Gold: {village.stash.resource.gold}
          </li>
        </ul>
      </div>
    )
  );
