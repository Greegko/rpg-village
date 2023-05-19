import { Item } from "./item";
import { Resource } from "./resource";

export interface Loot {
  resource: Resource;
  items: Item[];
}
