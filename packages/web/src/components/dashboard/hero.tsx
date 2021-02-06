import * as React from 'react';
import { connect } from 'react-redux';
import { values } from 'ramda';
import { Unit } from '@rpg-village/core';
import { ProgressBar, Icons } from '../core';
import { heroUnitsSelector, GameStoreState } from '../../game';

const propertyMapper = (state: GameStoreState, props: HeroProperties): HeroState => ({
  hero: values(heroUnitsSelector(state.game)).find(({ id }) => id === props.heroId)
});

interface HeroProperties {
  heroId: string;
}

interface HeroState {
  hero: Unit;
}

import './hero.scss';
export const Hero = connect(propertyMapper)(
  ({ hero }: HeroState) => (
    <div className="hero">
      <div className="hero__name">
        {hero.name}
      </div>
      <ProgressBar icon={Icons.Heart} color="crimson" value={hero.hp} maxValue={hero.maxhp} />
      <div className="hero__attack">
        Attack: {hero.dmg}
      </div>
    </div>
  )
);