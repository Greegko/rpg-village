import { last } from "rambda";
import { createSignal, onMount } from "solid-js";

import { Ticker } from "pixi.js";

import {
  BattlefieldConfig,
  BattlefieldRendererConfig,
  createBattlefieldInstance,
  createRendererInstance,
} from "@rpg-village/battleground-core";

import { AssetManager } from "./assets";
import { UserControl } from "./plugins/user-control";
import { ResourceManager } from "./resource";
import { generateMap } from "./resource/map-generator";

export const Game = () => {
  const [battlegroundCanvas, setBattlegroundCanvas] = createSignal<HTMLCanvasElement>();

  const userControl = new UserControl();
  const ticker = new Ticker();
  ticker.maxFPS = 60;

  const [fps, setFPS] = createSignal(0);
  const [tick, setTick] = createSignal(0);

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const seedParam = urlParams.get("seed");

    const map = generateMap();

    const config: BattlefieldConfig = {
      map,
      seed: seedParam || Math.floor(Math.random() * 1_000_000_000).toString(),
    };

    const rendererConfig: BattlefieldRendererConfig = {
      cameraPosition: { x: 0, y: 0 },
      viewport: [window.innerWidth, window.innerHeight],
    };

    const assetManager = new AssetManager();
    const resourceManager = new ResourceManager();
    const renderer = createRendererInstance(rendererConfig, assetManager);
    const battleField = createBattlefieldInstance(config, resourceManager);

    if (!seedParam) {
      urlParams.set("seed", config.seed);
      window.history.replaceState({}, "", `${location.pathname}?${urlParams}`);
    }

    const doTick = () => {
      setTick(tick => tick + 1);

      battleField.tick();

      const battleFieldState = battleField.getState();

      renderer.renderScene(battleFieldState);

      if (battleField.isFinished) {
        ticker.stop();
      }
    };

    ticker.start();

    await assetManager.init();

    renderer.setMap(map);
    await renderer.onReady;
    setBattlegroundCanvas(renderer.getCanvas());

    const heroUnitId = last(battleField.getState().units).id;
    renderer.setFocusOnUnit(heroUnitId);

    battleField.setUserControlledUnit(heroUnitId);

    ticker.add(({ FPS }) => {
      setFPS(Math.floor(FPS));
      doTick();
    });

    userControl.hookEvenets();
    userControl.addEventListener("direction", direction => battleField.setUnitDirection(heroUnitId, direction));
    userControl.addEventListener("click", position => battleField.setUnitShootAction(heroUnitId, position));
  });

  return (
    <div>
      <div class="absolute text-white text-xs font-mono">
        FPS: {fps()} - Tick: {tick()}
      </div>
      <div class="w-fit border border-red-500">{battlegroundCanvas()}</div>
    </div>
  );
};
