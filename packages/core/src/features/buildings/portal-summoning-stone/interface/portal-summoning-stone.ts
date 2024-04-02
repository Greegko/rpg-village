import { Portal } from "@features/buildings/portal";

export type PortalSummoningStoneID = string;
export type PortalSummoningStone = { id: PortalSummoningStoneID; level: number; portals: Portal[] };
