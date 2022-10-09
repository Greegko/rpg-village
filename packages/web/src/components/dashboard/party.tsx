import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { ActivityID, PartyID } from "@rpg-village/core";

import {
  PartyActionType,
  partyStateSelector,
  setAutoExplore,
  setPartyAction,
  useGameAIStateSelector,
} from "@web/store/ai";
import { activityByIdSelector, partyByIdSelector, useGameStateSelector } from "@web/store/game";

import { Asset } from "../core";
import { Hero } from "./hero";

import "./party.scss";

interface PartyDisplayProperties {
  partyId: PartyID;
}

export const PartyDisplay = (props: PartyDisplayProperties) => {
  const party = useGameStateSelector(state => partyByIdSelector(state, props.partyId));
  const partyAIState = useGameAIStateSelector(state => partyStateSelector(state, props.partyId)) || {};
  const dispatch = useDispatch();

  const setAction = useCallback(
    (partyActionType: PartyActionType) => {
      dispatch(setPartyAction({ partyId: props.partyId, partyAction: { type: partyActionType } }));
      setActionExplore(false);
    },
    [props.partyId],
  );

  const setActionExplore = useCallback(
    (enable: boolean) => {
      dispatch(setAutoExplore({ partyId: props.partyId, enable }));
    },
    [props.partyId],
  );

  return (
    <div className="party">
      <div>Location: {party.locationId}</div>
      <Activity activityId={party.activityId} />
      <br />

      <div className="party__actions">
        <Action
          iconId="treasure-map"
          active={partyAIState.autoExplore}
          onClick={() => setActionExplore(!partyAIState.autoExplore)}
        />

        <Action
          iconId="village"
          active={!partyAIState.autoExplore && partyAIState.action?.type === PartyActionType.MoveToVillage}
          onClick={() => setAction(PartyActionType.MoveToVillage)}
        />

        <Action
          iconId="healing"
          active={!partyAIState.autoExplore && partyAIState.action?.type === PartyActionType.Heal}
          onClick={() => setAction(PartyActionType.Heal)}
        />

        <Action
          iconId="body"
          active={!partyAIState.autoExplore && partyAIState.action?.type === PartyActionType.Training}
          onClick={() => setAction(PartyActionType.Training)}
        />

        <Action
          iconId="portal"
          active={!partyAIState.autoExplore && partyAIState.action?.type === PartyActionType.GoIntoPortal}
          onClick={() => setAction(PartyActionType.GoIntoPortal)}
        />
      </div>

      <br />
      {party.unitIds.map(heroId => (
        <Hero key={heroId} heroId={heroId} />
      ))}
    </div>
  );
};

const Action = ({ active, onClick, iconId }: { active: boolean; onClick: any; iconId: string }) => (
  <span className={"party__action " + (active ? "active" : "")} onClick={onClick}>
    <Asset id={iconId} size="icon" />
  </span>
);

const Activity = ({ activityId }: { activityId?: ActivityID }) => {
  if (!activityId) return null;

  const activity = useGameStateSelector(state => activityByIdSelector(state, activityId));

  return <>Activity: {activity ? activity.name : "Idle"}</>;
};
