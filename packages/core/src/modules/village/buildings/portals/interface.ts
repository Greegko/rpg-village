import { MapID } from "@modules/map";

export type PortalID = string;
export type PortalState = {
  id: PortalID;
  mapId: MapID;
};

export enum PortalActivity {
  GatherResourceFromPortal = "portal/gather-resource-from-portal",
}
