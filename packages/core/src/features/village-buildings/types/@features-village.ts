import { ShopID } from "@features/shop";
import { VillageBuilding } from "@features/village";

declare module "@features/village" {
  interface VillageState {
    blacksmith: number;
    trainingField: number;
    runeWorkshop: number;
    portals: number;
    shop: { level: number; shopId: ShopID };
  }
}

declare module "@features/village/interfaces/village-building" {
  export enum VillageBuilding {
    Blacksmith = "blacksmith",
    Portals = "portals",
    TrainingField = "trainingField",
    RuneWorkshop = "runeWorkshop",
    Shop = "shop",
  }
}

(VillageBuilding as any)["Blacksmith"] = "blacksmith";
(VillageBuilding as any)["Portals"] = "portals";
(VillageBuilding as any)["TrainingField"] = "trainingField";
(VillageBuilding as any)["RuneWorkshop"] = "runeWorkshop";
(VillageBuilding as any)["Shop"] = "shop";
