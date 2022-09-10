import { keys } from "ramda";
import { useDispatch } from "react-redux";

import { VillageCommand } from "@rpg-village/core";

import { playerPartiesSelector, useGameStateSelector, villageSelector } from "@web/store/game";
import { useExecuteCommandDispatch } from "@web/store/game-command";
import { changePage, pageSelector, useGameUISelector } from "@web/store/game-ui";
import { GamePageType } from "@web/store/game-ui/interface";

import { CharacterSheet } from "./character-sheet";
import { Header } from "./header";
import { OpenPortalPage } from "./open-portal-page";
import { PartyDisplay } from "./party";

import "./dashboard.scss";

export const Dashboard = () => {
  const page = useGameUISelector(pageSelector);

  return (
    <>
      <Header />

      <div className="dashboard">
        <div className="dashboard-sidebar">
          <Parties />
          <Village />
        </div>

        <div className="dashboard-page">
          {page && (
            <div>{page.page === GamePageType.CharacterSheet && <CharacterSheet unitId={page.args.unitId} />}</div>
          )}
          {page && <div>{page.page === GamePageType.OpenPortal && <OpenPortalPage />}</div>}
        </div>
      </div>
    </>
  );
};

const Parties = () => {
  const executeCommand = useExecuteCommandDispatch();
  const parties = useGameStateSelector(playerPartiesSelector);

  return (
    <div className="parties">
      Parties:
      <br />
      {keys(parties).map(partyId => (
        <PartyDisplay key={partyId} partyId={partyId} />
      ))}
      <button onClick={() => executeCommand({ command: VillageCommand.HireHero })}>Hire Hero</button>
    </div>
  );
};

const Village = () => {
  const executeCommand = useExecuteCommandDispatch();
  const village = useGameStateSelector(villageSelector);

  return (
    <div className="village">
      <div>Village:</div>
      <div>House Level: {village.houses}</div>
      <div>Blacksmith Level: {village.blacksmith}</div>
      <div>Rune Workshop: {village.runeWorkshop}</div>
      <div>Training Field Level: {village.trainingField}</div>
      <div>Portal Level: {village.portals}</div>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildHouse })}>Upgrade House</button>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildBlacksmith })}>Upgrade Blashmith</button>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildRuneWorkshop })}>
        Upgrade Rune Workshop
      </button>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildTrainingField })}>
        Upgrade Training Field
      </button>

      <Portals />
    </div>
  );
};

const Portals = () => {
  const executeCommand = useExecuteCommandDispatch();
  const dispatch = useDispatch();

  return (
    <>
      Portals:
      <button onClick={() => executeCommand({ command: VillageCommand.BuildPortals })}>Build Portal</button>
      <button onClick={() => dispatch(changePage({ page: GamePageType.OpenPortal }))}>Open Portal</button>
    </>
  );
};
