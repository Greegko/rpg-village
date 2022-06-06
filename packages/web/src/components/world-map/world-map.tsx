import { useCallback, useState } from "react";

import { MapID } from "@rpg-village/core";

import { mapSelector, useGameUISelector } from "../../game";
import { MapStage } from "./map/map-stage";

import "./world-map.scss";

export const WorldMap = () => {
  const worldMapId = useGameUISelector<MapID, any>(mapSelector);
  const [mapSize, setMapSize] = useState<[number, number] | null>(null);

  const mapRef = useCallback<(element: HTMLDivElement) => void>(node => {
    if (!node) return;

    const handleResize = () => setMapSize([node.offsetWidth, node.offsetHeight]);

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!worldMapId) return null;

  return (
    <div className="worldmap" ref={mapRef}>
      {mapSize && <MapStage worldMapId={worldMapId} width={mapSize[0]} height={mapSize[1]} />}
    </div>
  );
};
