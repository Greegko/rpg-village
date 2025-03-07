import { performance } from "node:perf_hooks";
import { merge, sum } from "rambda";
import { expect, test } from "vitest";

import { Map } from "@/features/map";

import { createBattlefieldInstance } from "../../create-battlefield-instance";
import { clearInstances as clearBattlefieldInstances } from "../../injection-container";
import { BattlefieldConfig } from "../../interface";
import { createPlayableUrl } from "./create-playable-url";
import { getMapSize } from "./get-map-size";

interface PerformanceTestConfig {
  seed?: string;
  map: Partial<Map>;
  createPlayableLink?: boolean;
}

const round = (v: number, prec: number) => Math.round(v * 10 ** prec) / 10 ** prec;

export function performanceTest(testName: string, { map, createPlayableLink, seed }: PerformanceTestConfig) {
  test(testName, () => {
    const mapWithDefault = merge({ tiles: [], tileSize: 0, size: getMapSize(map?.units || []), units: [], mapObjects: [] }, map);

    const config = {
      map: mapWithDefault,
      seed: seed || Math.random().toString(),
    } as BattlefieldConfig;

    performance.mark("create-start");
    clearBattlefieldInstances();

    const battlefield = createBattlefieldInstance(config, null!);
    performance.measure("create", "create-start");

    if (createPlayableLink) {
      console.log("Playable url");
      console.log(createPlayableUrl(mapWithDefault, config.seed));
    }

    let tickCounter = 1;
    while (!battlefield.isFinished) {
      performance.mark("tick-" + tickCounter + "-start");
      battlefield.tick();
      performance.measure("tick-" + tickCounter, "tick-" + tickCounter + "-start");
      performance.clearMarks();

      tickCounter += 1;
    }

    const measures = performance.getEntries();

    const tickEntries = measures.slice(2).map(x => x.duration);

    const total = sum(tickEntries);
    const avarage = total / tickEntries.length;

    console.log("Ticks   ", tickCounter);
    console.log("Created ", round(measures[0].duration, 4), "ms");
    console.log("Init    ", round(measures[1].duration, 4), "ms");
    console.log("Avg     ", round(avarage, 4), "ms");
    console.log("Total   ", round(total, 4), "ms");

    expect(1).toBe(1);
  });
}
