import { PartyID } from "@rpg-village/core";

import { activityByIdSelector, partyByIdSelector, useGameStateSelector } from "@web/store/game";

import { Hero } from "./hero";

interface PartyDisplayProperties {
  partyId: PartyID;
}

export const PartyDisplay = (props: PartyDisplayProperties) => {
  const party = useGameStateSelector(state => partyByIdSelector(state, props.partyId));
  const activity = useGameStateSelector(state => activityByIdSelector(state, party.activityId!));

  return (
    <>
      Location: {party.locationId}
      <br />
      Activity: {activity ? activity.name : "Idle"}
      <br />
      {party.unitIds.map(heroId => (
        <Hero key={heroId} heroId={heroId} />
      ))}
    </>
  );
};
