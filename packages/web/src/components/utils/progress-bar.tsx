import * as React from 'react';

interface ProgressBarProperties {
  iconUrl: string;
  maxValue: number;
  value: number;
  color: string;
}

export const ProgressBar = ({ iconUrl, maxValue, value, color }: ProgressBarProperties) => (
  <div className="progressbar">
    <img className="progressbar__icon" src={iconUrl} />
    <div className="progressbar__placeholder" style={{ backgroundColor: '#333', height: 12 }}>
      <div className="progressbar__liquid" style={{ backgroundColor: color, width: Math.max(0, (value / maxValue) * 100) + '%', height: 12 }} />
      <div className="progressbar__value">{Math.ceil(Math.max(0, value))} / {maxValue}</div>
    </div>
  </div>
)
