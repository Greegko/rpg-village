import { createSignal, onMount } from "solid-js";

import { Ticker } from "pixi.js";

import { Battlefield, BattlefieldConfig, BattlefieldRenderer } from "@rpg-village/battleground-core";

import { HerosHoursAssetManager } from "./assets/hero-hours/hero-hours-asset-manager";
import { ResourceManager, playgroundDefaultBattlefieldInit } from "./resource";

export const Game = () => {
  const [battlegroundCanvas, setBattlegroundCanvas] = createSignal<HTMLCanvasElement>();

  const ticker = new Ticker();
  ticker.maxFPS = 60;

  const [fps, setFPS] = createSignal(0);
  const [tick, setTick] = createSignal(0);

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const seedParam = urlParams.get("seed");

    const config: BattlefieldConfig = {
      mapSize: [window.innerWidth, window.innerHeight],
      seed: seedParam || Math.floor(Math.random() * 1_000_000_000).toString(),
    };

    const assetManager = new HerosHoursAssetManager();
    const resourceManager = new ResourceManager();
    const renderer = new BattlefieldRenderer(assetManager);
    const battleField = new Battlefield(config, resourceManager);

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

    battleField.init(playgroundDefaultBattlefieldInit);
    setBattlegroundCanvas(await renderer.init(config));

    ticker.add(({ FPS }) => {
      setFPS(Math.floor(FPS));
      doTick();
    });
  });

  return (
    <div>
      <div style={{ position: "absolute", color: "white", "font-size": "12px" }}>
        FPS: {fps()} - Tick: {tick()}
      </div>
      {battlegroundCanvas()}
    </div>
  );
};
