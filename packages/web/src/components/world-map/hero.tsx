import * as React from 'react';
import { ProgressBar } from '../utils';

interface HeroProperties {
  location: string;
  attack: string;
  hp: number;
  maxhp: number;
  name: string;
  activityProgress: string;
}

export const Hero = ({ name, hp, maxhp, attack, activityProgress, location }: HeroProperties) => (
  <div className="herolist__item">
    <div className="herolist__item-name">
      {name}
    </div>
    <ProgressBar iconUrl={this.hpIcon()} color='crimson' value={hp} maxValue={maxhp} />
    <div className="herolist__item-activity">
      {activityProgress}
    </div>
    <div className="herolist__item-location">
      {location}
    </div>
    <div className="herolist__item-attack">
      Attack: {attack}
    </div>
  </div>
);