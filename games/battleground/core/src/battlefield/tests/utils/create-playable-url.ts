import lzString from "lz-string";

import { Map } from "@/features/map";

export function createPlayableUrl(map: Map, seed: string): string {
  const baseUrl = "http://localhost:8080?mod=tester";

  const initStateUrlFragment = "&initState=" + encodeURIComponent(lzString.compressToBase64(JSON.stringify(map)));

  const seedUrlFragment = seed ? "&seed=" + seed : "";

  return baseUrl + seedUrlFragment + initStateUrlFragment;
}
