import * as React from 'react';
import { Icon, Icons, Size } from '../shared';

interface ProgressBarProperties {
  icon: Icons;
  maxValue: number;
  value: number;
  color: string;
}

export const ProgressBar = ({ icon, maxValue, value, color }: ProgressBarProperties) => (
  <div className="progressbar">
    <span className="progressbar__icon"><Icon icon={icon} size={Size.Tiny} /></span>
    <div className="progressbar__placeholder" style={{ backgroundColor: '#333', height: 12 }}>
      <div className="progressbar__liquid" style={{ backgroundColor: color, width: Math.max(0, (value / maxValue) * 100) + '%', height: 12 }} />
      <div className="progressbar__value">{Math.ceil(Math.max(0, value))} / {maxValue}</div>
    </div>
  </div>
);
