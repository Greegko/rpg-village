import gsap from "gsap";
import { GlowFilter } from "pixi-filters";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { once } from "rambda";

import { Position } from "@rpg-village/utils/node";

import { Effect, EffectType } from "@/features/effect";
import { Unit } from "@/features/unit";

import { pairwise, pairwiseDeepDiff } from "../../utils";
import { AnimatedSprite } from "../animated-sprite";
import { inject } from "../injection-container";
import { AssetManagerToken } from "../interface";
import { CreateNodeInterface, createNodePlugin } from "./create-node";

export const healthbarNodePlugin = createNodePlugin(() => {
  return ({ getNode }: CreateNodeInterface) => {
    const healthbarNode = new Graphics();

    const onStateUpdate = (state: { hp: number; maxHp: number; size: number }) => {
      healthbarNode.pivot.set(-state.size * 0.1, -state.size - 2);

      const percentage = state.hp / state.maxHp;

      const color = percentage > 0.6 ? 0x008000 : percentage > 0.3 ? 0xffff00 : 0xff0000;

      healthbarNode.clear();
      healthbarNode.rect(0, 0, state.size * 0.8 * percentage, 5).fill(color);
    };

    getNode().addChild(healthbarNode);
    return { onStateUpdate };
  };
});

declare module "./create-node" {
  interface CreateNodeInterface {
    select(): void;
    unselect(): void;
  }
}

export const selectableNodePlugin = createNodePlugin(() => {
  return ({ getNode }: CreateNodeInterface) => {
    const onStateUpdate = () => {};
    const select = () => (getNode().filters = [new GlowFilter()]);
    const unselect = () => (getNode().filters = []);
    return { onStateUpdate, select, unselect };
  };
});

export const moveableNodePlugin = createNodePlugin(() => {
  return ({ getNode }: CreateNodeInterface) => {
    const onStateUpdate = (state: { position: Position }) => {
      getNode().x = state.position.x;
      getNode().y = state.position.y;
    };
    return { onStateUpdate };
  };
});

type UnitStatus = "shield-break";
const SHIELD_BREAK_ICON = "icons/spells/shield_break";
export const statusesNodePlugin = createNodePlugin(() => {
  return ({ getNode }: CreateNodeInterface) => {
    const assetManager = inject(AssetManagerToken);
    const statusesContainer = new Container();
    const onStateUpdate = (state: { effects: Effect[] }) => {
      const statuses = (() => {
        const shieldBreakEffect = state.effects.find(x => x.type === EffectType.Armor && (x as any).power < 0);

        return [shieldBreakEffect && SHIELD_BREAK_ICON].filter(x => x) as UnitStatus[];
      })();

      statuses.forEach(status => {
        const texture = assetManager.getAsset(status);

        statusesContainer.addChild(new Sprite(texture));
      });
    };

    getNode().addChild(statusesContainer);

    return { onStateUpdate };
  };
});

declare module "./create-node" {
  interface CreateNodeInterface {
    getNode(): Container;
  }
}

export const rootNodePlugin = createNodePlugin(() => {
  return () => {
    const node = new Container();
    return { getNode: () => node };
  };
});

declare module "./create-node" {
  interface CreateNodeInterface {
    getSprite(): AnimatedSprite;
  }
}

enum Direction {
  Left = 1,
  Right,
}
export const renderAnimatedSpriteNodePlugin = createNodePlugin(() => {
  return ({ getNode }: CreateNodeInterface) => {
    const assetManager = inject(AssetManagerToken);
    let sprite: AnimatedSprite;

    const onStateUpdate = once((state: Unit) => {
      const unitSprite = assetManager.getSprite(state.spriteId);

      sprite = new AnimatedSprite(unitSprite.texture, unitSprite.animations, "idle");
      sprite.animationSpeed = 0.075;

      const baseRatio = state.size / sprite.height;
      sprite.scale.x = baseRatio;
      sprite.scale.y = baseRatio;

      getNode().position.copyFrom(state.position);
      getNode().addChild(sprite);
    });

    return { onStateUpdate, getSprite: () => sprite };
  };
});

export const hpChangeNumberDisplayNodePlugin = createNodePlugin(() => {
  return ({ getNode }: CreateNodeInterface) => {
    function createNumberTextAnimation(node: Container, val: number, color: string) {
      const text = new Text({ text: val, style: { fontSize: 14, fill: color } });
      text.x = 12;
      text.y = 0;

      gsap.to(text, {
        x: text.x + 5,
        y: text.y - 20,
        duration: 1,
        onComplete: () => {
          node.removeChild(text);
          text.destroy();
        },
      });

      node.addChild(text);
    }

    const stateChanges = pairwiseDeepDiff<{ hp: number }>();

    const hpChangesText = pairwise((prevHp: number | null, nextHp: number) => {
      if (prevHp === null) return;

      createNumberTextAnimation(getNode(), Math.abs(prevHp - nextHp), prevHp < nextHp ? "green" : "red");
    });

    const onStateUpdate = (state: Unit) => {
      const changes = stateChanges({ hp: state.hp });

      if (changes.hp) {
        hpChangesText(state.hp);
      }
    };

    return { onStateUpdate };
  };
});

export const animationSpriteNodePlugin = createNodePlugin(() => {
  return ({ getSprite }: CreateNodeInterface) => {
    const getAnimation = (state: Unit) => {
      if (state.hp === 0) return "dead";
      if (
        state.activeAction &&
        state.activeAction.speed > 0 &&
        state.actionsCooldowns.get(state.activeAction.action) === 0 &&
        state.activeAction.action.animation
      )
        return state.activeAction.action.animation;

      if (state.moveDirection) return "move";

      return "idle";
    };

    const getFacing = (state: Unit) => {
      if (state.activeAction) {
        if (state.activeAction.targetUnit) {
          return state.position.x > state.activeAction.targetUnit.position.x ? Direction.Left : Direction.Right;
        }

        if (state.activeAction.targetPosition) {
          return state.position.x > state.activeAction.targetPosition.x ? Direction.Left : Direction.Right;
        }
      }

      if (state.moveDirection) {
        return state.moveDirection.x < 0 ? Direction.Left : Direction.Right;
      }

      return undefined;
    };

    const setUnitFacingDirection = (sprite: AnimatedSprite, direction: Direction.Left | Direction.Right | undefined | null) => {
      if (direction === undefined || direction == null) return;

      sprite.scale.x = direction === Direction.Left ? -Math.abs(sprite.scale.x) : Math.abs(sprite.scale.x);
      sprite.x = sprite.scale.x < 0 ? sprite.width : 0;
    };

    type CalculatedState = { facing: Direction.Left | Direction.Right | undefined; animation: string };

    const stateChanges = pairwiseDeepDiff<CalculatedState>();

    const onStateUpdate = (state: Unit) => {
      const sprite = getSprite();
      const changes = stateChanges({ facing: getFacing(state), animation: getAnimation(state) });

      if (changes) {
        if ("facing" in changes) {
          setUnitFacingDirection(sprite, changes.facing);
        }

        if ("animation" in changes) {
          if (changes.animation === "dead") {
            sprite.setState("die");
            sprite.onLoop = () => {
              sprite.setState("dead");
              delete sprite.onLoop;
            };
          } else {
            sprite.setState(changes.animation ? changes.animation : "idle");
          }
        }
      }
    };

    return { onStateUpdate };
  };
});
