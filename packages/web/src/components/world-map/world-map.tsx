import { useCallback, useState } from "react";
import { connect } from "react-redux";

import { MapID } from "@rpg-village/core";

import { GameStoreState, worldMapIdSelector } from "../../game";
import { MapStage } from "./map/map-stage";

import "./world-map.scss";

const propertyMapper = (state: GameStoreState) => {
  return {
    worldMapId: worldMapIdSelector(state.game),
  };
};

interface WorldMapPropteries {
  worldMapId: MapID;
}

export const WorldMap = connect(propertyMapper)(({ worldMapId }: WorldMapPropteries) => {
  const [mapSize, setMapSize] = useState<[number, number] | null>(null);

  const mapRef = useCallback<(element: HTMLDivElement) => void>(node => {
    if (!node) return;

    const handleResize = () => setMapSize([node.offsetWidth, node.offsetHeight]);

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="worldmap" ref={mapRef}>
      {mapSize && <MapStage worldMapId={worldMapId} width={mapSize[0]} height={mapSize[1]} />}
    </div>
  );
});
