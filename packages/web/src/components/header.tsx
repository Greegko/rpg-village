import * as React from 'react';
import { DeveloperToolbar } from './dev/developer-toolbar';
import { VillageStats } from "./villagestats";

import './header.scss';
export const Header = () => {
  const [devToolboxVisible, setDevToolboxVisibile] = React.useState<boolean>();

  return (
    <div className="header">
      <VillageStats />
      <button className={"dev-toolbox-button" + (devToolboxVisible ? " active" : '')} onClick={() => setDevToolboxVisibile(val => !val)}>Dev Toolbox</button>

      {devToolboxVisible && <DeveloperToolbar />}
    </div>
  )
};
