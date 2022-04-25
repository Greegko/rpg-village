import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { Map } from "@modules/map";
import { VillageStashService } from "@modules/village";
import { PortalsCommand, PortalsCommandOpenPortalArgs } from "./portals-command";

@injectable()
export class PortalsCommandHandler {
  constructor(private map: Map, private villageStashService: VillageStashService) {}

  @commandHandler(PortalsCommand.OpenPortal)
  openPortal(args: PortalsCommandOpenPortalArgs) {
    const item = this.villageStashService.takeItem(args.dungeonKeyId);

    if (item) {
      this.map.createMap();
    }
  }
}
