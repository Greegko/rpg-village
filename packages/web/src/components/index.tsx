import * as React from 'react';
import { connect } from 'react-redux';
import { VillageStats } from './villagestats';
import { WorldMap } from './world-map/world-map';
import { Village } from './village/village';
import { GameScreen, GameStoreState } from '../game';

function propertyMapper(state: GameStoreState) {
  return {
    activeScreen: state.ui.activeScreen
  }
}

interface GameFieldProperties {
  activeScreen: GameScreen;
}

export const GameField = connect(propertyMapper)
  (
    ({ activeScreen }: GameFieldProperties) => (
      <>
        {activeScreen === GameScreen.WorldMap && <WorldMap />}
        {activeScreen === GameScreen.Village && <Village />}

        <VillageStats />
      </>
    )
  );
