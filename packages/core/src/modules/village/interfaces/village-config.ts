export enum VillageConfig {
  DirectLootToVillage = "village/direct-loot-to-village",
}

declare module "@core" {
  interface ModuleConfig {
    [VillageConfig.DirectLootToVillage]: boolean;
  }
}
