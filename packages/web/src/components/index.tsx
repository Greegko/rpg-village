import * as React from 'react';
import { connect } from 'react-redux';
import { VillageStats } from './villagestats';
import { WorldMap } from './world-map/world-map';
import { GameStoreState, playerPartiesSelector } from '../game';
import { DeveloperToolbar } from './dev/developer-toolbar';
import { Dashboard } from './dashboard';
import { keys } from 'ramda';
import { Party } from '@rpg-village/core';

function propertyMapper(state: GameStoreState) {
  return {
    parties: playerPartiesSelector(state.game),
    activeScreen: state.ui.activeScreen
  }
}

interface GameFieldState {
  parties: Record<string, Party>;
}

export const GameField = connect(propertyMapper)
  (
    ({ parties }: GameFieldState) => (
      <>
        <WorldMap />

        <Dashboard parties={keys(parties)} />

        <VillageStats />
        <DeveloperToolbar />
      </>
    )
  );
