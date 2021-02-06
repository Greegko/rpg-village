import * as React from 'react';
import { connect } from 'react-redux';
import { WorldMap } from './world-map/world-map';
import { GameStoreState, playerPartiesSelector } from '../game';
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

import './game-field.scss';
export const GameField = connect(propertyMapper)
  (
    ({ parties }: GameFieldState) => (
      <>
        <Dashboard parties={keys(parties)} />
        <WorldMap />
      </>
    )
  );
