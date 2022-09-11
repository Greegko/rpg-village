import { ChangeEvent, useCallback } from "react";
import { useDispatch } from "react-redux";

import { ActivityID, PartyID } from "@rpg-village/core";

import { PartyPreference, partyPreferenceSelector, setPartyPreference, useGameAIStateSelector } from "@web/store/ai";
import { activityByIdSelector, partyByIdSelector, useGameStateSelector } from "@web/store/game";

import { Hero } from "./hero";

interface PartyDisplayProperties {
  partyId: PartyID;
}

export const PartyDisplay = (props: PartyDisplayProperties) => {
  const party = useGameStateSelector(state => partyByIdSelector(state, props.partyId));
  const preference = useGameAIStateSelector(state => partyPreferenceSelector(state, props.partyId));
  const dispatch = useDispatch();

  const selectPartyPreference = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      dispatch(
        setPartyPreference({ partyId: props.partyId, partyPreference: Number(event.target.value) as PartyPreference }),
      );
    },
    [props.partyId],
  );

  return (
    <>
      <div>Location: {party.locationId}</div>
      <div>
        Preference:
        <select value={preference} onChange={selectPartyPreference}>
          <option value={PartyPreference.Idle}>Idle</option>
          <option value={PartyPreference.AutoExplore}>Auto Explore</option>
          <option value={PartyPreference.MoveToVillage}>Move to village</option>
        </select>
      </div>
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
