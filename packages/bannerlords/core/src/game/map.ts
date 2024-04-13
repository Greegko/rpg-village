import { Castle, Clan, Fraction, Lord, Product, Town, Village } from "@models";

interface MapData {
  fractions: Fraction[];
  clans: Clan[];
  lords: Lord[];
  towns: Town[];
  castles: Castle[];
  villages: Village[];
}

export const mapData: MapData = {
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
      belongsTo: "",
      position: { x: 0, y: 0 },
      stash: { gold: 0, items: [] },
    },
  ],
};
