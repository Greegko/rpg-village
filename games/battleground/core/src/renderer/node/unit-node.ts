import { createNodeFactory } from "./create-node";
import {
  animationSpriteNodePlugin,
  healthbarNodePlugin,
  hpChangeNumberDisplayNodePlugin,
  moveableNodePlugin,
  renderAnimatedSpriteNodePlugin,
  rootNodePlugin,
  selectableNodePlugin,
  statusesNodePlugin,
} from "./node-plugins";

export const createUnitNode = createNodeFactory([
  rootNodePlugin(),
  renderAnimatedSpriteNodePlugin(),
  animationSpriteNodePlugin(),
  hpChangeNumberDisplayNodePlugin(),
  moveableNodePlugin(),
  selectableNodePlugin(),
  healthbarNodePlugin(),
  statusesNodePlugin(),
]);

export const createProjectileNode = createNodeFactory([rootNodePlugin(), renderAnimatedSpriteNodePlugin(), moveableNodePlugin()]);
export const createMapObjectNode = createNodeFactory([rootNodePlugin(), renderAnimatedSpriteNodePlugin()]);
