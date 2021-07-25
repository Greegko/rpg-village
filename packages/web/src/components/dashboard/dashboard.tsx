import { connect } from "react-redux";
import { useState } from "react";
import { UnitID, VillageCommand, VillageState } from "@rpg-village/core";
import { ExecuteCommand } from "../../game";
import { PartyDisplay } from "./party";
import { Header } from "./header";
import { CharacterSheet } from "./character-sheet";

interface DashboardProperties {
  parties: string[];
  village: VillageState;
}

import "./dashboard.scss";
export const Dashboard = connect(
  null,
  ExecuteCommand,
)(({ parties, village, executeCommand }: DashboardProperties & ExecuteCommand) => {
  const [selectedUnit] = useState<UnitID | null>(null);

  return (
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

      {selectedUnit && <CharacterSheet unitId={selectedUnit} />}
    </div>
  );
});
