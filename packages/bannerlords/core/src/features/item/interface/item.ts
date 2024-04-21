export enum ItemType {
  Grain,
}

export type ItemID = string;
export type Item = { id: ItemID; itemType: ItemType; amount: number };
