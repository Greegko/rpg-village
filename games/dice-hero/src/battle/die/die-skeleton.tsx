import { JSXElement } from "solid-js";

import "./die-skeleton.scss";

const transforms: Record<number, [number, number]> = {
  1: [0, 0],
  2: [180, 0],
  5: [90, 0],
  4: [270, 0],
  3: [0, 90],
  6: [0, 270],
};

interface DieSkeleton {
  children: JSXElement[];
  number: number;
}

export const DieSkeleton = (props: DieSkeleton) => (
  <div
    class="die"
    style={{ "--die-size": "100px", transform: `rotateX(${transforms[props.number][0]}deg) rotateY(${transforms[props.number][1]}deg)` }}
  >
    {props.children}
  </div>
);
