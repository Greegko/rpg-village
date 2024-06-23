export enum ItemType {
  Grain,
}

export type Item = { itemType: ItemType; amount: number };
