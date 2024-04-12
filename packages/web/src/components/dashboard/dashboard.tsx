import { keys, values } from "rambda";
import { For, Match, Show, Switch, createComputed } from "solid-js";

import {
  ActivityCommand,
  BlacksmithCommand,
  ItemType,
  RuneWorkshopCommand,
  VillageBuildingCommand,
  VillageCommand,
  VillageID,
} from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/engine";
import {
  playerPartiesSelector,
  useGameStateSelector,
  villageActivitiesSelector,
  villageByIdSelector,
  villagesSelector,
} from "@web/store/game";
import {
  GamePageType,
  pageSelector,
  selectedVillageIdSelector,
  setPage,
  setSelectedVillage,
  useGameUiStateSelector,
} from "@web/store/ui";

import { CharacterSheet } from "./character-sheet";
import { Header } from "./header";
import { OpenPortalPage } from "./open-portal-page";
import { PartyDisplay } from "./party";
import { VillageShopPage } from "./village-shop";

import "./dashboard.scss";

export const Dashboard = () => {
  const page = useGameUiStateSelector(pageSelector);
  const villageId = useGameUiStateSelector(selectedVillageIdSelector);

  const villages = useGameStateSelector(villagesSelector);

  createComputed(() => {
    if (villageId()) return;
    if (!villages()) return;
    if (values(villages()).length === 0) return;

    setSelectedVillage(values(villages())[0].id);
  });

  return (
    <>
      <Show when={villageId()} keyed>
        {villageId => <Header villageId={villageId} />}
      </Show>
      <div class="dashboard">
        <div class="dashboard-sidebar">
          <Parties />
          <Show when={villageId()} keyed>
            {villageId => <Village villageId={villageId} />}
          </Show>
        </div>

        <div class="dashboard-page">
          <Switch>
            <Match when={page()?.page === GamePageType.CharacterSheet}>
              <CharacterSheet unitId={page()!.args.unitId} />
            </Match>
            <Match when={page()?.page === GamePageType.CharacterSheet && villageId()}>
              <OpenPortalPage villageId={villageId()!} />
            </Match>
            <Match when={page()?.page === GamePageType.CharacterSheet && villageId()}>
              <VillageShopPage villageId={villageId()!} />
            </Match>
          </Switch>
        </div>
      </div>
    </>
  );
};

const Parties = () => {
  const parties = useGameStateSelector(playerPartiesSelector);

  return (
    <div class="parties">
      Parties:
      <br />
      <For each={keys(parties())}>{partyId => <PartyDisplay partyId={partyId} />}</For>
    </div>
  );
};

const Village = (props: { villageId: VillageID }) => {
  const executeCommand = useGameExecuteCommand();
  const village = useGameStateSelector(state => villageByIdSelector(state, props.villageId));
  const villageActivities = useGameStateSelector(state => villageActivitiesSelector(state, props.villageId));

  return (
    <div class="village">
      <div>Village:</div>
      <div>
        Activities:
        <For each={villageActivities()}>
          {activity => (
            <div>
              {activity.name} - {(activity.startArgs as any).targetBuilding} {(activity.state as any).progress}
              <a
                onClick={() =>
                  executeCommand({ command: ActivityCommand.CancelActivity, args: { activityId: activity.id } })
                }
              >
                [x]
              </a>
            </div>
          )}
        </For>
      </div>
      <div>House Level: {village().buildings.houses}</div>
      <div>Shop Level: {village().buildings.shop?.level || 0}</div>
      <div>Blacksmith Level: {village().buildings.blacksmith}</div>
      <div>Rune Workshop: {village().buildings.runeWorkshop}</div>
      <div>Training Field Level: {village().buildings.trainingField}</div>
      <div>Portal Summoning Stone Level: {village().buildings.portalSummoningStone?.level || 0}</div>
      <button
        onClick={() =>
          executeCommand({ command: VillageBuildingCommand.BuildShop, args: { villageId: props.villageId } })
        }
      >
        Build Shop
      </button>

      <button onClick={() => setPage(GamePageType.VillageShopPage)}>Open Shop</button>

      <button
        onClick={() =>
          executeCommand({ command: VillageBuildingCommand.BuildHouse, args: { villageId: props.villageId } })
        }
      >
        Upgrade House
      </button>

      <button
        onClick={() => executeCommand({ command: VillageCommand.HireHero, args: { villageId: props.villageId } })}
      >
        Hire Hero
      </button>

      <button
        onClick={() =>
          executeCommand({ command: VillageBuildingCommand.BuildBlacksmith, args: { villageId: props.villageId } })
        }
      >
        Upgrade Blacksmith
      </button>

      <Show when={village()}>
        <button
          onClick={() =>
            executeCommand({
              command: BlacksmithCommand.CreateItem,
              args: { villageId: props.villageId, itemType: ItemType.Armor },
            })
          }
        >
          Create Armor
        </button>
        <button
          onClick={() =>
            executeCommand({
              command: BlacksmithCommand.CreateItem,
              args: { villageId: props.villageId, itemType: ItemType.Weapon },
            })
          }
        >
          Create Weapon
        </button>
        <button
          onClick={() =>
            executeCommand({
              command: BlacksmithCommand.CreateItem,
              args: { villageId: props.villageId, itemType: ItemType.Shield },
            })
          }
        >
          Create Shield
        </button>

        <button
          onClick={() =>
            executeCommand({ command: VillageBuildingCommand.BuildRuneWorkshop, args: { villageId: props.villageId } })
          }
        >
          Upgrade Rune Workshop
        </button>

        <button
          onClick={() =>
            executeCommand({ command: RuneWorkshopCommand.CreateRune, args: { villageId: props.villageId } })
          }
        >
          Forge Rune
        </button>

        <button
          onClick={() =>
            executeCommand({ command: RuneWorkshopCommand.ForgeDungeonKey, args: { villageId: props.villageId } })
          }
        >
          Forge Dungeon Key
        </button>

        <button
          onClick={() =>
            executeCommand({ command: VillageBuildingCommand.BuildTrainingField, args: { villageId: props.villageId } })
          }
        >
          Upgrade Training Field
        </button>

        <button
          onClick={() =>
            executeCommand({
              command: VillageBuildingCommand.BuildPortalSummoningStone,
              args: { villageId: props.villageId },
            })
          }
        >
          Build Portal Summoning Stone
        </button>
      </Show>

      <button onClick={() => setPage(GamePageType.OpenPortal)}>Open Portal</button>
    </div>
  );
};
