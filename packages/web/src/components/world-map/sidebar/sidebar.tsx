import * as React from 'react';
import { PartyDisplay } from './party';

interface SidebarProperties {
  parties: string[];
}

import './sidebar.scss';
export const Sidebar = ({ parties }: SidebarProperties) => (
  <div className='sidebar'>
    Parties:<br />

    {parties.map(partyId => <PartyDisplay key={partyId} partyId={partyId} />)}
  </div>
);
