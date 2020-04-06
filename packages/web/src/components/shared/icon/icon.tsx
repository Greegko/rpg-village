import * as React from 'react';

export type AVAILABLE_ICONS = 'attack' | 'explore' | 'travel';

interface IconProperties {
  name: AVAILABLE_ICONS;
}

import './icon.scss';
export const Icon = ({ name }: IconProperties) => {
  const [src, setSrc] = React.useState();

  React.useEffect(() => {
    const file = import('../../../assets/icons/' + name + ".svg");
    file.then(data => setSrc(data));
  }, []);

  return (
    <img className="icon" src={src} />
  );
};
