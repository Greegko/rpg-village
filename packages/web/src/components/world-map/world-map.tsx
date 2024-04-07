import { mapSelector, useGameUISelector } from "@web/store/ui";

import { MapStage } from "./map/map-stage";

export const WorldMap = () => {
  const activeMapId = useGameUISelector(mapSelector);

  if (!activeMapId) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-[#2e342b]">
      <MapStage worldMapId={activeMapId} />
    </div>
  );
};
