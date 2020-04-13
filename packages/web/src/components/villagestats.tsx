import * as React from 'react';
import { connect } from 'react-redux';
import { VillageCommand, VillageState, GeneralGameStoreState } from '@rpg-village/core';
import { GameStoreState, executeCommand } from '../game';

const propertyMapper = (state: GameStoreState) => {
  return {
    village: state.game.village,
    general: state.game.general
  }
}

const dispatchers = {
  executeCommand,
}

import './villagestats.scss';

interface VillageStatsProperties {
  village: VillageState;
  general: GeneralGameStoreState;
  executeCommand: typeof executeCommand;
}

export const VillageStats = connect(propertyMapper, dispatchers)
  (
    ({ village, general, executeCommand }: VillageStatsProperties) => (
      <div className="villagestats">
        <ul className='villagestats__list'>
          <li className="villagestats__list-item">
            Turn: {general.turn}
          </li>
          <li className="villagestats__list-item">
            Gold: {village.stash.resource.gold}
          </li>
        </ul>
        <div className='villagestats__buttons'>
          <button className="villagestats__buttons-btn" onClick={() => executeCommand({ command: VillageCommand.GenerateGold })}>Generate Gold</button>
          <button className="villagestats__buttons-btn" onClick={() => executeCommand({ command: VillageCommand.BuildHouse })}>Build House</button>
          <button className="villagestats__buttons-btn" onClick={() => executeCommand({ command: VillageCommand.HireHero })}>Hire Hero</button>
        </div>
      </div>
    )
  );
