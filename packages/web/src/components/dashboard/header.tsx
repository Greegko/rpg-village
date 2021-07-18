import { useState } from 'react';
import { DeveloperToolbox } from './developer-toolbox';
import { VillageStats } from "./villagestats";

import './header.scss';
export const Header = () => {
  const [devToolboxVisible, setDevToolboxVisibile] = useState<boolean>();

  return (
    <div className="header">
      <VillageStats />
      <button className={"dev-toolbox-button" + (devToolboxVisible ? " active" : '')} onClick={() => setDevToolboxVisibile(val => !val)}>Dev Toolbox</button>

      {devToolboxVisible && <DeveloperToolbox />}
    </div>
  )
};
