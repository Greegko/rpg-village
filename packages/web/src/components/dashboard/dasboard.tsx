import * as React from 'react';
import { PartyDisplay } from './party';

interface DashboardProperties {
  parties: string[];
}

import './dashboard.scss';
export const Dashboard = ({ parties }: DashboardProperties) => (
  <div className='dashboard'>
    Parties:<br />

    {parties.map(partyId => <PartyDisplay key={partyId} partyId={partyId} />)}
  </div>
);
