import * as React from 'react';

export enum Icons { Attack = 'attack', Explore = 'explore', Travel = 'travel' };

interface IconProperties {
  name: Icons;
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
