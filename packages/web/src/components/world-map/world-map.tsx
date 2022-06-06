import { useCallback, useState } from "react";

import { mapSelector, useGameUISelector } from "@web/store/game-ui";

import { MapStage } from "./map/map-stage";

import "./world-map.scss";

export const WorldMap = () => {
  const activeMapId = useGameUISelector(mapSelector);
  const [mapSize, setMapSize] = useState<[number, number] | null>(null);

  const mapRef = useCallback<(element: HTMLDivElement) => void>(node => {
    if (!node) return;

    const handleResize = () => setMapSize([node.offsetWidth, node.offsetHeight]);

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!activeMapId) return null;

  return (
    <div className="worldmap" ref={mapRef}>
      {mapSize && <MapStage worldMapId={activeMapId} width={mapSize[0]} height={mapSize[1]} />}
    </div>
  );
};
