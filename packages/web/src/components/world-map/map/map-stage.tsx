import { MapID } from "@rpg-village/core";

import { Map } from "./map";

interface MapStageProperties {
  worldMapId: MapID;
}

export const MapStage = ({ worldMapId }: MapStageProperties) => <Map mapId={worldMapId} />;
