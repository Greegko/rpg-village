import { trackStore } from "@solid-primitives/deep";
import { get, set } from "idb-keyval";
import { flatten, without } from "rambda";
import { For, Show, createComputed, createResource, createSignal, on } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";

import { Application, Assets, Spritesheet } from "pixi.js";

import { FloatWindow, setWindows, useWindow, useWindowRoot, windows } from "../components/float-window";

const app = new Application();
app.init();

type SpriteID = string;

type Position = { x: number; y: number };
type MapObject = { position: Position; spriteId: SpriteID };

type Map = {
  tileSize: number;
  size: [number, number];
  tiles: (SpriteID | null)[][];
  mapObjects: MapObject[];
};

const STORAGE_KEY = "tile-map-editor-state";

interface StorageState {
  map: Map;
  windows: FloatWindow[];
  spritesheetFiles: SpriteSheetFiles;
}

type SpriteSheetFiles = { json: File; image: File };
const [spritesheetFiles, setSpritesheetFiles] = createSignal<SpriteSheetFiles | null>(null);
const [selectedSprite, setSelectedSprite] = createSignal<string | null>(null);
const [map, setMap] = createStore<Map>({ tileSize: 48, size: [1200, 1152], tiles: [], mapObjects: [] });

const mapColumns = map.size[0] / map.tileSize;
const mapRows = map.size[1] / map.tileSize;

const [spritesheet] = createResource(
  () => spritesheetFiles(),
  async () => {
    const { json, image } = spritesheetFiles()!;

    const fileJSON = JSON.parse(await json.text());
    return new Promise<Spritesheet>(resove => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = function () {
        Assets.load(this.result as string).then(texture => {
          const spriteSheet = new Spritesheet(texture, fileJSON);
          return spriteSheet.parse().then(() => resove(spriteSheet));
        });
      };
    });
  },
);

createComputed(
  on(
    () => [trackStore(map), spritesheetFiles(), trackStore(windows)],
    () => set(STORAGE_KEY, { map: unwrap(map), spritesheetFiles: spritesheetFiles(), windows: unwrap(windows) } as StorageState),
    { defer: true },
  ),
);

get<StorageState>(STORAGE_KEY).then(state => {
  if (!state) {
    const { addWindow } = useWindow();
    addWindow("SpriteSheetWindow", "Spritesheet");
    addWindow("MapConfigWindow", "Map config");

    return;
  }

  const { map, spritesheetFiles, windows } = state;

  setMap(map);
  setSpritesheetFiles(spritesheetFiles);
  setWindows(windows);
});

setMap(produce(map => (map.tiles = Array.from({ length: mapRows }, () => Array.from({ length: mapColumns }, () => null)))));

const getGroup = (spriteName: string) => spriteName.split("/")[0];

export const AppPage = () => {
  useWindowRoot();

  const { setContent } = useWindow();

  setContent("SpriteSheetWindow", SpriteSheetWindow);
  setContent("MapConfigWindow", MapConfigWindow);

  return (
    <div class="select-none">
      <div class="border w-fit">
        <RenderMap />
      </div>
    </div>
  );
};

const RenderMap = () => {
  const placeSpriteOnTile = ([x, y]: [x: number, y: number], e: MouseEvent) => {
    const spriteId = selectedSprite()!;
    if (getGroup(spriteId) === "Terrain") {
      placeTerrain(x, y, spriteId);
    } else {
      placeObject(e.clientX, e.clientY, spriteId);
    }
  };
  const placeTerrain = (x: number, y: number, spriteId: string) => {
    setMap(
      produce(map => {
        if (map.tiles[x] === undefined) map.tiles[x] = [];
        map.tiles[x][y] = spriteId;
      }),
    );
  };

  const placeObject = (x: number, y: number, spriteId: string) => {
    setMap(
      produce(map => {
        map.mapObjects.push({ position: { x, y }, spriteId: spriteId });
      }),
    );
  };

  return (
    <div class="relative">
      <div>
        <For each={map.tiles}>
          {(rows, rowIndex) => (
            <div class="flex">
              <For each={rows}>
                {(_, columIndex) => (
                  <span
                    style={{ width: map.tileSize + "px", height: map.tileSize + "px" }}
                    onClick={[placeSpriteOnTile, [rowIndex(), columIndex()]]}
                  >
                    <Show when={map.tiles[rowIndex()][columIndex()]} keyed>
                      {tile => <TextureDisplay textureId={tile} />}
                    </Show>
                  </span>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <For each={map.mapObjects}>
        {mapObject => (
          <span class="absolute" style={{ top: mapObject.position.y + "px", left: mapObject.position.x + "px" }}>
            <TextureDisplay textureId={mapObject.spriteId} />
          </span>
        )}
      </For>
    </div>
  );
};

const TextureDisplay = (props: { textureId: string }) => {
  const texture = () => spritesheet() && spritesheet()!.textures[props.textureId];
  const [resource] = createResource(
    () => texture(),
    () => app.renderer.extract.base64(texture()!),
  );
  return (
    <Show when={texture()} keyed>
      {texture => <img src={resource()} width={texture.width} height={texture.height} />}
    </Show>
  );
};

const MapConfigWindow = () => {
  const handleSizeChange = (index: number, value: number) => {
    const newSize = [...map.size];
    newSize[index] = value * map.tileSize;
    setMap("size", newSize as [number, number]);

    const mapColumns = newSize[0] / map.tileSize;
    const mapRows = newSize[1] / map.tileSize;

    setMap(
      produce(map => {
        map.tiles = map.tiles.slice(0, mapRows).map(row => row.slice(0, mapColumns));
        for (let i = 0; i < mapRows; i++) {
          if (!map.tiles[i]) map.tiles[i] = [];
          for (let j = 0; j < mapColumns; j++) {
            if (!map.tiles[i][j]) map.tiles[i][j] = null;
          }
        }
      }),
    );
  };

  const copyMapToClipboard = () => {
    const mapJSON = JSON.stringify(map);
    navigator.clipboard.writeText(mapJSON).then(() => {
      alert("Map JSON copied to clipboard!");
    });
  };

  return (
    <div>
      <div>
        Tile Size:
        <input type="number" value={map.tileSize} onInput={e => setMap("tileSize", parseInt(e.currentTarget.value))} />
      </div>
      <div>
        Map Size (in tiles):
        <input
          type="number"
          class="w-10 border"
          value={map.size[0] / map.tileSize}
          onInput={e => handleSizeChange(0, parseInt(e.currentTarget.value))}
        />
        x
        <input
          type="number"
          class="w-10 border"
          value={map.size[1] / map.tileSize}
          onInput={e => handleSizeChange(1, parseInt(e.currentTarget.value))}
        />
      </div>
      <div>
        Map Size (in px): {map.size[0]} x {map.size[1]} px
      </div>
      <button class="border p-2 cursor-pointer" onClick={copyMapToClipboard}>
        Copy Map JSON
      </button>
    </div>
  );
};

const SpriteSheetWindow = () => {
  const [activeTab, setActiveTab] = createSignal<string | null>(null);

  const getTextures = () => {
    const sheet = spritesheet();

    if (!sheet) return [];

    const textures = Object.values(sheet.textures || {});

    const animatedTextures = Object.values(sheet.animations || {});
    const animatedTexturesFlatten = flatten(animatedTextures);

    const notAnimated = without(animatedTexturesFlatten, textures);

    const availableTextures = [...notAnimated, ...animatedTextures.map(x => x[0])];

    return availableTextures.map((x: any) => x.label);
  };

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      setSpritesheetFiles({ json: files[0], image: files[1] });
    }
  };

  const handleDropOver = (e: DragEvent) => e.preventDefault();

  return (
    <div class="h-full" onDrop={handleDrop} onDragOver={handleDropOver}>
      <Show when={spritesheet()}>
        <div class="flex">
          <For
            each={Object.keys(
              Object.keys(spritesheet()!.textures).reduce(
                (acc, name) => {
                  const group = getGroup(name);
                  if (!acc[group]) acc[group] = [];
                  acc[group].push(name);
                  return acc;
                },
                {} as Record<string, string[]>,
              ),
            )}
          >
            {groupName => (
              <div class="tab" onClick={() => setActiveTab(groupName)}>
                {groupName}
              </div>
            )}
          </For>
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            title={"Clear"}
            style={{ width: map.tileSize + "px", height: map.tileSize + "px" }}
            class="cursor-pointer"
            onClick={[setSelectedSprite, null]}
          ></div>
          <For each={getTextures().filter(name => getGroup(name) === activeTab())}>
            {name => (
              <div
                title={name}
                style={{ width: map.tileSize + "px", height: map.tileSize + "px" }}
                class="cursor-pointer"
                onClick={[setSelectedSprite, name]}
              >
                <TextureDisplay textureId={name} />
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
