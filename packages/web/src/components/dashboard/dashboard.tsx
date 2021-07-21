import { connect } from "react-redux";
import { VillageCommand, VillageState } from "@rpg-village/core";
import { PartyDisplay } from "./party";
import { Header } from "./header";
import { executeCommand } from "../../game";

const storeDispatchers = { executeCommand };

interface DashboardProperties {
  parties: string[];
  village: VillageState;
  executeCommand: typeof executeCommand;
}

import "./dashboard.scss";
export const Dashboard = connect(
  null,
  storeDispatchers,
)(({ parties, village, executeCommand }: DashboardProperties) => (
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
  </div>
));
