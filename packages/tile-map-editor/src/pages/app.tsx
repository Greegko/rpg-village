import { flatten, without } from "rambda";
import { For, Show, createResource, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { Application, Assets, Spritesheet, Texture } from "pixi.js";

import { FloatWindow } from "../components/float-window";

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

const [spritesheet, setSpritesheet] = createSignal<Spritesheet | null>(null);
const [selectedSprite, setSelectedSprite] = createSignal<string | null>(null);
const [map, setMap] = createStore<Map>({ tileSize: 48, size: [1200, 1152], tiles: [], mapObjects: [] });

const mapColumns = map.size[0] / map.tileSize;
const mapRows = map.size[1] / map.tileSize;

setMap(produce(map => (map.tiles = Array.from({ length: mapRows }, () => Array.from({ length: mapColumns }, () => null)))));

const getGroup = (spriteName: string) => spriteName.split("/")[0];

export const AppPage = () => {
  return (
    <div class="flex select-none">
      <div class="border w-fit">
        <RenderMap />
      </div>

      <MapConfigWindow />
      <SpriteSheetWindow />
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
                      {tile => <TextureDisplay texture={spritesheet()!.textures[tile]} />}
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
            <TextureDisplay texture={spritesheet()!.textures[mapObject.spriteId]} />
          </span>
        )}
      </For>
    </div>
  );
};

const TextureDisplay = (props: { texture: Texture }) => {
  const [resource] = createResource(() => app.renderer.extract.base64(props.texture));
  return <img src={resource()} width={props.texture.width} height={props.texture.height} />;
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
    <FloatWindow title="Map config">
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
    </FloatWindow>
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
      const fileImage = files[1];

      const reader = new FileReader();
      reader.readAsDataURL(fileImage);

      const fileJSON = JSON.parse(await files[0].text());

      reader.onloadend = function () {
        Assets.load(this.result as string).then(texture => {
          const spriteSheet = new Spritesheet(texture, fileJSON);
          return spriteSheet.parse().then(() => setSpritesheet(spriteSheet));
        });
      };
    }
  };

  const handleDropOver = (e: DragEvent) => e.preventDefault();

  return (
    <FloatWindow title="Sprite Sheet">
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
                  <TextureDisplay texture={spritesheet()!.textures[name]} />
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </FloatWindow>
  );
};
