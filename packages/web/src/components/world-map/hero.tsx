import * as React from 'react';
import { connect } from 'react-redux';
import { Unit } from '@rpg-village/core';
import { ProgressBar } from '../utils';
import { Icons } from '../shared';
import { heroUnitsSelector, GameStoreState } from '../../game';

const propertyMapper = (state: GameStoreState, props: HeroProperties): HeroState => ({
  hero: heroUnitsSelector(state.game).find(({ id }) => id === props.heroId),
  locationId: 'string',
  activity: 'string'
});

interface HeroProperties {
  heroId: string;
}

interface HeroState {
  hero: Unit;
  locationId: string;
  activity: string;
}

import './hero.scss';
export const Hero = connect(propertyMapper)(
  ({ hero, activity, locationId }: HeroState) => (
    <div className="hero">
      <div className="hero__name">
        {hero.name}
      </div>
      <ProgressBar icon={Icons.Heart} color="crimson" value={hero.hp} maxValue={hero.maxhp} />
      <div className="hero__activity">
        {activity}
      </div>
      <div className="hero__location">
        {locationId}
      </div>
      <div className="hero__attack">
        Attack: {hero.dmg}
      </div>
    </div>
  )
);