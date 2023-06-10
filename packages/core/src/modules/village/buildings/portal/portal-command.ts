import { PartyID } from "@features/party";
import { ItemID } from "@models";
import { MapLocationID } from "@modules/map";

export enum PortalCommand {
  OpenPortal = "portal/open-portal",
  EnterPortal = "portal/enter-portal",
  LeavePortal = "portal/leave-portal",
}

export interface PortalCommandOpenPortalArgs {
  dungeonKeyId: ItemID;
}

export interface PortalCommandEnterPortalArgs {
  partyId: PartyID;
  portalLocationId: MapLocationID;
}

export interface PortalCommandLeavePortalArgs {
  partyId: PartyID;
  portalLocationId: MapLocationID;
}

declare module "@core" {
  export interface CommandType {
    [PortalCommand.OpenPortal]: PortalCommandOpenPortalArgs;
    [PortalCommand.EnterPortal]: PortalCommandEnterPortalArgs;
    [PortalCommand.LeavePortal]: PortalCommandLeavePortalArgs;
  }
}
