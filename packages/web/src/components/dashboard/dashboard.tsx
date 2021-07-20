import { PartyDisplay } from "./party";
import { Header } from "./header";

interface DashboardProperties {
  parties: string[];
}

import "./dashboard.scss";
export const Dashboard = ({ parties }: DashboardProperties) => (
  <div className="dashboard">
    <Header />

    <div>
      Parties:
      <br />
      {parties.map(partyId => (
        <PartyDisplay key={partyId} partyId={partyId} />
      ))}
    </div>
  </div>
);
