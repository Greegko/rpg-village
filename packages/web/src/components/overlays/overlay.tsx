import * as React from 'react';
import { connect } from 'react-redux';
import { closeOverlay } from '../../game';

interface OverlayProperties {
  width: number;
  height: number;
  children: any;
}

const storeDispatchers = { closeOverlay };

interface OverlayAction {
  closeOverlay: typeof closeOverlay;
}

import './overlay.scss';
export const Overlay = connect(null, storeDispatchers)(
  ({ width, height, children, closeOverlay }: OverlayProperties & OverlayAction) => (
    <div className="overlay">
      <div className="overlay-background" onClick={closeOverlay}></div>
      <div className="overlay-content" style={{ height, width }}>
        {children}
      </div>
    </div>
  )
);
