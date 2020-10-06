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
      <div className="village">
        <div onClick={() => executeCommand({ command: VillageCommand.GenerateGold })}>Generate Gold - {village.stash.resource.gold}</div>
        <div onClick={() => executeCommand({ command: VillageCommand.BuildBlacksmith })}>Blacksmith - {village.blacksmith}</div>
        <div onClick={() => executeCommand({ command: VillageCommand.BuildHouse })}>Houses {village.houses}</div>
        <div onClick={() => executeCommand({ command: VillageCommand.HireHero })}>Heroes {village.heroes.length}</div>
      </div>
    )
  );
