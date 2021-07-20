import { GameStoreState, partiesSelector, activitiesSelector } from "../../game";
import { connect } from "react-redux";
import { Hero } from "./hero";
import { PartyID, Party, Activity } from "@rpg-village/core";

const propertyMapper = (state: GameStoreState, props: PartyDisplayProperties): PartyDisplayState => {
  const party = partiesSelector(state.game)[props.partyId];
  return {
    party,
    activity: party.activityId ? activitiesSelector(state.game)[party.activityId] : null,
  };
};

interface PartyDisplayProperties {
  partyId: PartyID;
}

interface PartyDisplayState {
  party: Party;
  activity: Activity | null;
}

export const PartyDisplay = connect(propertyMapper)(({ party, activity }: PartyDisplayState) => (
  <>
    Location: {party.locationId}
    <br />
    Activity: {activity ? activity.name : "Idle"}
    <br />
    {party.unitIds.map(heroId => (
      <Hero key={heroId} heroId={heroId} />
    ))}
  </>
));
