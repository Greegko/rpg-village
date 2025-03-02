import { FrameObject, AnimatedSprite as PixiJSAniamtedSprite, Texture } from "pixi.js";

import { AnimationFrame, AnimationStateID } from "./interface";

export type States = Record<AnimationStateID, AnimationFrame>;

export class AnimatedSprite extends PixiJSAniamtedSprite {
  private states: States;
  private animationState: AnimationStateID;

  constructor(textures: Texture[] | FrameObject[], states: States, state: AnimationStateID, autoUpdate = true) {
    super(textures, autoUpdate);
    this.states = states;
    this.animationState = state;
  }

  override set currentFrame(newValue: number) {
    super.currentFrame = newValue;
  }

  override get currentFrame(): number {
    if (this.states === undefined) return 0;

    const state = this.states[this.animationState];

    const [start, end] = typeof state === "number" ? [state, state + 1] : state;

    const length = end - start;

    const originalCurrentFrame = super.currentFrame;

    let currentFrame = originalCurrentFrame % length;

    return start + currentFrame;
  }

  setState(animationState: AnimationStateID) {
    this.animationState = animationState;

    const state = this.states[animationState];

    if (typeof state === "number") {
      this.gotoAndPlay(state);
    } else {
      this.gotoAndPlay(state[0]);
    }
  }
}
