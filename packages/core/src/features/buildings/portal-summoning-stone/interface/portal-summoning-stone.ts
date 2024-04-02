import { Portal } from "@features/buildings/portal";

export type PortalSummoningStoneID = string & { __typeGuard: "portal-summoning-stone-id" };
export type PortalSummoningStone = { id: PortalSummoningStoneID; level: number; portals: Portal[] };
