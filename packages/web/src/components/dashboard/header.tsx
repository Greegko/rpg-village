import { keys } from "rambda";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { mapsSelector, useGameStateSelector, worldMapIdSelector } from "@web/store/game";
import { mapSelector, selectMap, useGameUISelector } from "@web/store/ui";

import { DeveloperToolbox } from "./developer-toolbox";
import { VillageStats } from "./villagestats";

import "./header.scss";

const Maps = () => {
  const maps = useGameStateSelector(mapsSelector);
  const worldMapId = useGameStateSelector(worldMapIdSelector);
  const selectedMapId = useGameUISelector(mapSelector);

  const dispatcher = useDispatch();

  return (
    <span>
      {keys(maps).map(mapId => (
        <button
          key={mapId}
          onClick={() => dispatcher(selectMap(mapId))}
          className={selectedMapId === mapId ? "active" : ""}
        >
          {mapId === worldMapId ? "World Map" : mapId}
        </button>
      ))}
    </span>
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
