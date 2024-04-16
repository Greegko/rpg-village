import { MapLocationID } from "@features/map";

export type PortalID = string;
export type Portal = { id: PortalID; connectedLocationId: MapLocationID };
