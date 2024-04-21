import { Castle } from "@features/castle";
import { Clan } from "@features/clan";
import { Fraction } from "@features/fraction";
import { Product } from "@features/item";
import { Lord } from "@features/lord";
import { Position } from "@features/map";
import { Town } from "@features/town";
import { Village } from "@features/village";

export type WithoutId<T> = Omit<T, "id">;
export type WithPosition<T> = T & { position: Position };

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
  clans: [{ id: "", name: "", belongTo: "" }],
  lords: [{ id: "", name: "", stash: { gold: 0, items: [] }, belongTo: "", position: { x: 0, y: 0 } }],
  towns: [
    {
      id: "",
      name: "",
      prosperity: 0,
      position: { x: 0, y: 0 },
      belongTo: "",
      garrison: [],
      stash: { gold: 0, items: [] },
    },
  ],
  castles: [{ id: "", name: "", position: { x: 0, y: 0 }, belongTo: "", garrison: [], stash: { gold: 0, items: [] } }],
  villages: [
    {
      id: "",
      name: "",
      prosperity: 0,
      produce: Product.Grain,
      belongTo: "",
      position: { x: 0, y: 0 },
      stash: { gold: 0, items: [] },
    },
  ],
};
