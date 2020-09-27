import * as React from 'react';
import { connect } from 'react-redux';
import { VillageStats } from './villagestats';
import { WorldMap } from './world-map/world-map';
import { GameOverlay, GameScreen, GameStoreState } from '../game';
import { VillageOverlay } from './overlays/village-overlay';

function propertyMapper(state: GameStoreState) {
  return {
    activeScreen: state.ui.activeScreen,
    overlay: state.ui.overlay
  }
}

interface GameFieldProperties {
  activeScreen: GameScreen;
  overlay: GameOverlay;
}

export const GameField = connect(propertyMapper)
  (
    ({ activeScreen, overlay }: GameFieldProperties) => (
      <>
        {activeScreen === GameScreen.WorldMap && <WorldMap />}
        {overlay === GameOverlay.Village && <VillageOverlay />}

        <VillageStats />
      </>
    )
  );
