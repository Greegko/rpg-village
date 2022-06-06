import { connect } from "react-redux";

import { VillageCommand, VillageState } from "@rpg-village/core";

import { GameStoreState } from "../../game";
import { GamePage } from "../../game/pages";
import { ExecuteCommand } from "../../game/store/game-command";
import { CharacterSheet } from "./character-sheet";
import { Header } from "./header";
import { PartyDisplay } from "./party";

import "./dashboard.scss";

interface DashboardProperties {
  parties: string[];
  village: VillageState;
}

interface DashboardState {
  page?: GamePage;
}

const propertyMapper = (state: GameStoreState): DashboardState => ({
  page: state.ui.page,
});

export const Dashboard = connect(
  propertyMapper,
  ExecuteCommand,
)(({ parties, village, page, executeCommand }: DashboardProperties & ExecuteCommand & DashboardState) => (
  <div className="dashboard">
    <Header />

    <div className="parties">
      Parties:
      <br />
      {parties.map(partyId => (
        <PartyDisplay key={partyId} partyId={partyId} />
      ))}
      <button onClick={() => executeCommand({ command: VillageCommand.HireHero })}>Hire Hero</button>
    </div>

    <div className="village">
      <div>Village:</div>
      <div>House Level: {village.houses}</div>
      <div>Blacksmith Level: {village.blacksmith}</div>
      <div>Rune Workshop: {village.runeWorkshop}</div>
      <div>Training Field Level: {village.trainingField}</div>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildHouse })}>Upgrade House</button>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildBlacksmith })}>Upgrade Blashmith</button>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildRuneWorkshop })}>
        Upgrade Rune Workshop
      </button>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildTrainingField })}>
        Upgrade Training Field
      </button>
    </div>

    {page && <CharacterSheet unitId={page.args.unitId} />}
  </div>
));
