import { Show, createSignal, onMount } from "solid-js";
import { decompressFromBase64 } from "lz-string";

import {
  AssetManager,
  Battlefield,
  BattlefieldConfig,
  BattlefieldRenderer,
  BattlefieldState,
  SpellSelection,
} from "@rpg-village/battleground";

import { Debug } from "./debug";
import { Loop } from "./loop";
import { ResourceManager, playgroundDefaultBattlefieldInit } from "./playground";
import { HerosHoursAssetManager } from "./assets/hero-hours/hero-hours-asset-manager";
import { AssetManagerContext, SpellBook } from "./components";

export const Game = () => {
  const [spellSelection, setSpellSelection] = createSignal<SpellSelection>();
  const [assetManager, setAssetManager] = createSignal<AssetManager>();
  const [battlegroundCanvas, setBattlegroundCanvas] = createSignal<HTMLCanvasElement>();

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

    const loop = new Loop(() => {
      battleField.tick();

      const battleFieldState = battleField.getState();

      renderer.renderScene(battleFieldState);

      if (battleField.isFinished) {
        loop.stop();
      }
    });

    const debug = new Debug(loop);

    debug.hookGlobalKeys();

    await assetManager.init();

    battleField.init(gameInitState);
    spellSelection.init();
    setBattlegroundCanvas(await renderer.init(config));

    setSpellSelection(spellSelection);
    setAssetManager(assetManager);

    if (tick) {
      loop.jumpToTick(parseInt(tick));
    }

    loop.start();
  });

  return (
    <div>
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
