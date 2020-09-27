import * as React from 'react';

interface OverlayProperties {
  width: number;
  height: number;
  children: any;
}

import './overlay.scss';
export const Overlay = ({ width, height, children }: OverlayProperties) => (
  <div className="overlay" style={{ height, width }}>
    {children}
  </div>
);
