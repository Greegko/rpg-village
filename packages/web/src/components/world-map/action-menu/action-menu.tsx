import * as React from 'react';
import { Icon, Icons } from '../../shared/icon';

interface Action {
  title: string;
  tooltip: string;
  icon: Icons;
  onClick: () => void;
}

interface ActionMenuProperties {
  actions: Action[];
}

import './action-menu.scss';
export const ActionMenu = ({ actions }: ActionMenuProperties) => (
  <div className="action-menu">
    {actions.map(action => <ActionMenuItem key={action.icon} action={action} />)}
  </div>
);

const ActionMenuItem = ({ action }: { action: Action }) => (
  <div className="action-menu-item">
    <i onClick={action.onClick}>
      <Icon name={action.icon}></Icon>
    </i>
  </div>
);