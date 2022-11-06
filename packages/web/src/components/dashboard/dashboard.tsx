import { keys } from "ramda";
import { useDispatch } from "react-redux";

import { BlacksmithCommand, ItemType, RuneWorkshopCommand, VillageCommand } from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/react-hooks";
import { playerPartiesSelector, useGameStateSelector, villageSelector } from "@web/store/game";
import { changePage, pageSelector, useGameUISelector } from "@web/store/ui";
import { GamePageType } from "@web/store/ui/interface";

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
  const parties = useGameStateSelector(playerPartiesSelector);

  return (
    <div className="parties">
      Parties:
      <br />
      {keys(parties).map(partyId => (
        <PartyDisplay key={partyId} partyId={partyId} />
      ))}
    </div>
  );
};

const Village = () => {
  const executeCommand = useGameExecuteCommand();
  const dispatch = useDispatch();
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

      <button onClick={() => executeCommand({ command: VillageCommand.HireHero })}>Hire Hero</button>

      <button onClick={() => executeCommand({ command: VillageCommand.BuildBlacksmith })}>Upgrade Blacksmith</button>
      <button
        onClick={() => executeCommand({ command: BlacksmithCommand.CreateItem, args: { itemType: ItemType.Armor } })}
      >
        Create Armor
      </button>
      <button
        onClick={() => executeCommand({ command: BlacksmithCommand.CreateItem, args: { itemType: ItemType.Weapon } })}
      >
        Create Weapon
      </button>
      <button
        onClick={() => executeCommand({ command: BlacksmithCommand.CreateItem, args: { itemType: ItemType.Shield } })}
      >
        Create Shield
      </button>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildRuneWorkshop })}>
        Upgrade Rune Workshop
      </button>

      <button onClick={() => executeCommand({ command: RuneWorkshopCommand.CreateRune })}>Forge Rune</button>

      <button onClick={() => executeCommand({ command: RuneWorkshopCommand.ForgeDungeonKey })}>
        Forge Dungeon Key
      </button>

      <button onClick={() => executeCommand({ command: VillageCommand.BuildTrainingField })}>
        Upgrade Training Field
      </button>

      <button onClick={() => executeCommand({ command: VillageCommand.BuildPortalSummonerStone })}>
        Build Portal Summoner Stone
      </button>
      <button onClick={() => dispatch(changePage({ page: GamePageType.OpenPortal }))}>Open Portal</button>
    </div>
  );
};
