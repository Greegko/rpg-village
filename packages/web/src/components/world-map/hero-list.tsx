import * as React from 'react';
import { Unit } from '@rpg-village/core';
import { Hero } from './hero';
import { map } from 'ramda';

import './sidebar.scss';

interface HeroListProperties {
  heroes: Unit[];
}

export const HeroList = ({ heroes }: HeroListProperties) => (
  <div className='herolist'>
    Heroes in Village:
    {map(heroKey => <Hero key={heroKey} {...heroes[heroKey]} />, Object.keys(heroes))}
  </div>
)
