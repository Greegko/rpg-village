import * as React from 'react';
import { UnitID } from '@rpg-village/core';
import { Hero } from './hero';

interface SidebarProperties {
  heroes: UnitID[];
}

import './sidebar.scss';
export const Sidebar = ({ heroes }: SidebarProperties) => (
  <div className='sidebar'>
    Heroes in Village:

    {heroes.map(heroId => <Hero key={heroId} heroId={heroId} />)}
  </div>
);
