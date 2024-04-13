import { For, Show } from "solid-js";

import { ActivityCommand, ActivityID, PartyID } from "@rpg-village/village-manager";

import { useGameExecuteCommand } from "@web/engine";
import {
  PartyActionType,
  clearPartyAction,
  partyStateSelector,
  setAutoExplore,
  setPartyAction,
  useGameAiStateSelector,
} from "@web/store/ai";
import {
  activityByIdSelector,
  mapByPartyIdSelector,
  mapLocationByPartyIdSelector,
  partyActivitySelector,
  partyByIdSelector,
  useGameStateSelector,
  worldMapIdSelector,
} from "@web/store/game";

import { Asset } from "../core";
import { Hero } from "./hero";

import "./party.scss";

interface PartyDisplayProperties {
  partyId: PartyID;
}

export const PartyDisplay = (props: PartyDisplayProperties) => {
  const worldMapId = useGameStateSelector(state => worldMapIdSelector(state));
  const currentMap = useGameStateSelector(state => mapByPartyIdSelector(state, props.partyId))!;
  const partyMapLocation = useGameStateSelector(state => mapLocationByPartyIdSelector(state, props.partyId));
  const partyActivity = useGameStateSelector(state => partyActivitySelector(state, props.partyId));

  const isWorldMap = () => currentMap()?.id === worldMapId();

  const party = useGameStateSelector(state => partyByIdSelector(state, props.partyId));
  const partyAIState = useGameAiStateSelector(state => partyStateSelector(state, props.partyId));

  const setAction = (partyActionType: PartyActionType) => {
    setPartyAction(props.partyId, partyActionType);
    setActionExplore(false);
  };

  const setActionExplore = (enable: boolean) => setAutoExplore(props.partyId, enable);

  return (
    <div class="party">
      <div>Location: {partyMapLocation().id}</div>
      <Show when={partyActivity()?.id} keyed>
        {partyActivityId => <Activity activityId={partyActivityId} partyId={props.partyId} />}
      </Show>

      <Show when={partyAIState()} keyed>
        {partyAIState => (
          <div class="party__actions">
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

            <Show when={isWorldMap()}>
              <Action
                iconId="portal"
                active={!partyAIState.autoExplore && partyAIState.action?.type === PartyActionType.EnterPortal}
                onClick={() => setAction(PartyActionType.EnterPortal)}
              />
            </Show>
          </div>
        )}
      </Show>

      <For each={party().unitIds}>{unitId => <Hero heroId={unitId} />}</For>
    </div>
  );
};

const Action = (props: { active: boolean; onClick: any; iconId: string }) => (
  <span class={"party__action " + (props.active ? "active" : "")} onClick={props.onClick}>
    <Asset id={props.iconId} size="icon" />
  </span>
);

interface ActivityProps {
  activityId: ActivityID;
  partyId: PartyID;
}
const Activity = (props: ActivityProps) => {
  const executeCommand = useGameExecuteCommand();

  const activity = useGameStateSelector(state => activityByIdSelector(state, props.activityId));
  const cancelAction = () => {
    executeCommand({ command: ActivityCommand.CancelActivity, args: { activityId: activity().id } });
    clearPartyAction(props.partyId);
  };

  return (
    <Show when={activity()} keyed>
      {activity => (
        <div>
          Activity: {activity.name}
          <a onClick={cancelAction}>[x]</a>
        </div>
      )}
    </Show>
  );
};
