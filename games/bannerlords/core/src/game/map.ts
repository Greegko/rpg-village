import { Castle } from "@features/castle";
import { Clan } from "@features/clan";
import { Fraction } from "@features/fraction";
import { Product } from "@features/item";
import { Lord } from "@features/lord";
import { Point } from "@features/map";
import { Town } from "@features/town";
import { Village } from "@features/village";

export type WithoutId<T> = Omit<T, "id">;
export type WithPosition<T> = T & { position: Point };

export interface InitialMapData {
  fractions: Fraction[];
  clans: Clan[];
  lords: WithPosition<Lord>[];
  towns: WithPosition<Town>[];
  castles: WithPosition<Castle>[];
  villages: WithPosition<Village>[];
}

export const initialMapData: InitialMapData = {
  fractions: [
    { id: "fraction-western-id", name: "Western" },
    { id: "fraction-empire-id", name: "Empire" },
  ],
  // prettier-ignore
  clans: [
    { id: "bisu", name: "Bisu Clan", belongTo: "fraction-western-id" },
    { id: "granson", name: "Granson Clan", belongTo: "fraction-empire-id" }
  ],
  // prettier-ignore
  lords: [
    { id: "bisu-lord-1", name: "Bisuson", gold: 0, belongTo: "bisu", position: { x: 120, y: 120 } },
    { id: "bisu-lord-2", name: "Bisupar", gold: 0, belongTo: "bisu", position: { x: 140, y: 120 } },
    
    { id: "granson-lord-1", name: "Grand son", gold: 0, belongTo: "granson", position: { x: 220, y: 220 } },
    { id: "granson-lord-2", name: "Grand Grand son", gold: 0, belongTo: "granson", position: { x: 240, y: 220 } },
  ],
  towns: [
    {
      id: "bisumaron",
      name: "Bisumaron",
      prosperity: 10,
      position: { x: 100, y: 100 },
      belongTo: "bisu-lord-1",
      garrison: [],
      parties: [],
      stash: { gold: 0, items: [] },
    },

    {
      id: "grandenson",
      name: "Grandenson",
      prosperity: 10,
      position: { x: 200, y: 200 },
      belongTo: "granson-lord-1",
      garrison: [],
      parties: [],
      stash: { gold: 0, items: [] },
    },
  ],
  castles: [],
  villages: [
    {
      id: "bisumaron-village-1",
      name: "Bisumaroner",
      prosperity: 5,
      produce: Product.Grain,
      belongTo: "bisumaron",
      position: { x: 130, y: 100 },
      stash: { gold: 0, items: [] },
      parties: [],
    },

    {
      id: "grandenson-village-1",
      name: "Petit garçon",
      prosperity: 5,
      produce: Product.Grain,
      belongTo: "grandenson",
      position: { x: 230, y: 200 },
      stash: { gold: 0, items: [] },
      parties: [],
    },
  ],
};
