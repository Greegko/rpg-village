import { useState } from 'react';

export enum Icons { Heart = 'heart' };
export enum Size { Tiny = 'tiny' }

interface IconProperties {
  icon: Icons;
  size?: Size;
}

import './icon.scss';
export const Icon = ({ icon, size }: IconProperties) => {
  const [src] = useState();

  return (
    <img className={"icon" + (size === Size.Tiny ? " icon--tiny" : "")} src={src} />
  );
};
