import { ItemID } from "@models/item";
import { MapLocationID } from "@modules/map";
import { PartyID } from "@modules/party";

export enum PortalsCommand {
  OpenPortal = "portals/open-portal",
  EnterPortal = "portals/enter-portal",
  LeavePortal = "portals/leave-portal",
}

export interface PortalsCommandOpenPortalArgs {
  dungeonKeyId: ItemID;
}

export interface PortalsCommandEnterPortalArgs {
  partyId: PartyID;
  portalLocationId: MapLocationID;
}

export interface PortalsCommandLeavePortalArgs {
  partyId: PartyID;
  portalLocationId: MapLocationID;
}

declare module "@core/global-type/command-type" {
  interface CommandType {
    [PortalsCommand.OpenPortal]: PortalsCommandOpenPortalArgs;
    [PortalsCommand.EnterPortal]: PortalsCommandEnterPortalArgs;
    [PortalsCommand.LeavePortal]: PortalsCommandLeavePortalArgs;
  }
}
