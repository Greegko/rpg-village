import { connect } from "react-redux";
import { VillageCommand, VillageState } from "@rpg-village/core";
import { ExecuteCommand, GamePage, GameStoreState } from "../../game";
import { PartyDisplay } from "./party";
import { Header } from "./header";
import { CharacterSheet } from "./character-sheet";

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

import "./dashboard.scss";
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
      <button onClick={() => executeCommand({ command: VillageCommand.BuildHouse })}>Upgrade House</button>
      <button onClick={() => executeCommand({ command: VillageCommand.BuildBlacksmith })}>Upgrade Blashmith</button>
    </div>

    {page && <CharacterSheet unitId={page.args.unitId} />}
  </div>
));
