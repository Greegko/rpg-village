import { decompressFromBase64 } from "lz-string";
import { Show, createSignal, onMount } from "solid-js";

import { Ticker } from "pixi.js";

import {
  AssetManager,
  Battlefield,
  BattlefieldConfig,
  BattlefieldRenderer,
  BattlefieldState,
  SpellSelection,
} from "@rpg-village/battleground-core";

import { HerosHoursAssetManager } from "./assets/hero-hours/hero-hours-asset-manager";
import { AssetManagerContext, SpellBook } from "./components";
import { Debug } from "./debug";
import { ResourceManager, playgroundDefaultBattlefieldInit } from "./playground";

export const Game = () => {
  const [spellSelection, setSpellSelection] = createSignal<SpellSelection>();
  const [assetManager, setAssetManager] = createSignal<AssetManager>();
  const [battlegroundCanvas, setBattlegroundCanvas] = createSignal<HTMLCanvasElement>();

  const ticker = new Ticker();
  ticker.maxFPS = 60;

  const [fps, setFPS] = createSignal(0);
  const [tick, setTick] = createSignal(0);

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const seedParam = urlParams.get("seed");
    const initState = urlParams.get("initState");
    const tick = urlParams.get("tick");

    const config: BattlefieldConfig = {
      mapSize: [window.innerWidth, window.innerHeight],
      seed: seedParam || Math.floor(Math.random() * 1_000_000_000).toString(),
    };

    const assetManager = new HerosHoursAssetManager();
    const resourceManager = new ResourceManager();
    const renderer = new BattlefieldRenderer(assetManager);
    const battleField = new Battlefield(config, resourceManager);
    const spellSelection = new SpellSelection(renderer, battleField);

    if (!seedParam) {
      urlParams.set("seed", config.seed);
      window.history.replaceState({}, "", `${location.pathname}?${urlParams}`);
    }

    const gameInitState = (() => {
      if (initState) {
        return JSON.parse(decompressFromBase64(decodeURIComponent(initState))) as BattlefieldState;
      } else {
        return playgroundDefaultBattlefieldInit;
      }
    })();

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

    const debug = new Debug();

    debug.addEventListener("start", () => ticker.start());
    debug.addEventListener("stop", () => ticker.stop());
    debug.addEventListener("tick", () => doTick());

    debug.hookGlobalKeys();

    await assetManager.init();

    battleField.init(gameInitState);
    spellSelection.init();
    setBattlegroundCanvas(await renderer.init(config));

    setSpellSelection(spellSelection);
    setAssetManager(assetManager);

    ticker.add(({ FPS }) => {
      setFPS(Math.floor(FPS));
      doTick();
    });

    if (tick) {
      const ticks = parseInt(tick);

      for (let i = 0; i < ticks; i++) {
        doTick();
      }
    }
  });

  return (
    <div>
      <div style={{ color: "white", "font-size": "12px" }}>
        FPS: {fps()} - Tick: {tick()}
      </div>
      {battlegroundCanvas()}
      <Show when={assetManager()}>
        <AssetManagerContext.Provider value={assetManager()}>
          <Show when={spellSelection()} keyed>
            {spellSelection => (
              <SpellBook
                onSpellFinish={() => spellSelection.stopSpellSelection(true)}
                onSpellSelectionCancel={() => spellSelection.stopSpellSelection(false)}
                onSpellSelectionPositionChange={position => spellSelection.setSpellPosition(position)}
                onSpellSelectionStart={(spellId, position) => spellSelection.startSpellSelection(spellId, position)}
              />
            )}
          </Show>
        </AssetManagerContext.Provider>
      </Show>
    </div>
  );
};
