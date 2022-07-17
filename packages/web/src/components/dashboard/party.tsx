import { ActivityID, PartyID } from "@rpg-village/core";

import { activityByIdSelector, partyByIdSelector, useGameStateSelector } from "@web/store/game";

import { Hero } from "./hero";

interface PartyDisplayProperties {
  partyId: PartyID;
}

export const PartyDisplay = (props: PartyDisplayProperties) => {
  const party = useGameStateSelector(state => partyByIdSelector(state, props.partyId));

  return (
    <>
      Location: {party.locationId}
      <br />
      <Activity activityId={party.activityId} />
      <br />
      {party.unitIds.map(heroId => (
        <Hero key={heroId} heroId={heroId} />
      ))}
    </>
  );
};

const Activity = ({ activityId }: { activityId?: ActivityID }) => {
  if (!activityId) return null;

  const activity = useGameStateSelector(state => activityByIdSelector(state, activityId));

  return <>Activity: {activity ? activity.name : "Idle"}</>;
};
