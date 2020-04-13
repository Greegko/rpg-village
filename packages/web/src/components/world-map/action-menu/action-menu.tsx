import * as React from 'react';
import { connect } from 'react-redux';
import { Party } from '@rpg-village/core';
import { Icon, Icons } from '../../shared/icon';
import { GameStoreState, partiesGroupedOnLocationsSelector, partiesSelector } from '../../../game';

const propertyMapper = (state: GameStoreState, props: ActionMenuProperties): ActionMenuState => ({
  parties: partiesGroupedOnLocationsSelector(state)[props.locationId],
  selectedParty: partiesSelector(state)[props.selectedPartyId]
});

interface Action {
  icon: Icons;
  onClick: () => void;
}

interface ActionMenuProperties {
  locationId: string;
  selectedPartyId?: string;
}

interface ActionMenuState {
  parties: Party[];
  selectedParty?: Party;
}

import './action-menu.scss';
export const ActionMenu = connect(propertyMapper)(
  () => {
    const actions = [];

    return (
      <div className="action-menu">
        {actions.map(action => <ActionMenuItem key={action.icon} action={action} />)}
      </div>
    );
  }
);

const ActionMenuItem = ({ action }: { action: Action }) => (
  <div className="action-menu-item">
    <i onClick={action.onClick}>
      <Icon name={action.icon}></Icon>
    </i>
  </div>
);
