import { keys } from "ramda";
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  mapSelector,
  mapsSelector,
  selectMap,
  useGameStateSelector,
  useGameUISelector,
  worldMapIdSelector,
} from "../../game";
import { DeveloperToolbox } from "./developer-toolbox";
import { VillageStats } from "./villagestats";

import "./header.scss";

const Maps = () => {
  const maps = useGameStateSelector(mapsSelector);
  const worldMapId = useGameStateSelector(worldMapIdSelector);
  const selectedMapId = useGameUISelector(mapSelector);

  const dispatcher = useDispatch();

  return (
    <div style={{ width: "300px" }}>
      {keys(maps).map(mapId => (
        <button
          key={mapId}
          onClick={() => dispatcher(selectMap(mapId))}
          className={selectedMapId === mapId ? "active" : ""}
        >
          {mapId === worldMapId ? "World Map" : mapId}
        </button>
      ))}
    </div>
  );
};

export const Header = () => {
  const [devToolboxVisible, setDevToolboxVisibile] = useState<boolean>();

  return (
    <div className="header">
      <VillageStats />

      <Maps />

      <button
        className={"dev-toolbox-button" + (devToolboxVisible ? " active" : "")}
        onClick={() => setDevToolboxVisibile(val => !val)}
      >
        Dev Toolbox
      </button>

      {devToolboxVisible && <DeveloperToolbox />}
    </div>
  );
};
