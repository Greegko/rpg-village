import * as React from 'react';
import { Village } from "../village/village";
import { Overlay } from "./overlay";

export const VillageOverlay = () => <Overlay width={500} height={500}><Village /></Overlay>;