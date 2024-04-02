import { MapLocationID } from "@features/map";

export type PortalID = string & { __typeGuard: "portal-id" };
export type Portal = { id: PortalID; connectedLocationId: MapLocationID };
