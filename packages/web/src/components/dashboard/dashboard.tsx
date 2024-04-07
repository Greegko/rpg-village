import { keys, values } from "rambda";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  ActivityCommand,
  BlacksmithCommand,
  ItemType,
  RuneWorkshopCommand,
  VillageBuildingCommand,
  VillageCommand,
  VillageID,
} from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/react-hooks";
import {
  playerPartiesSelector,
  useGameStateSelector,
  villageActivitiesSelector,
  villageByIdSelector,
  villagesSelector,
} from "@web/store/game";
import { changePage, pageSelector, setVillage, useGameUISelector, villageSelector } from "@web/store/ui";
import { GamePageType } from "@web/store/ui/interface";

import { CharacterSheet } from "./character-sheet";
import { Header } from "./header";
import { OpenPortalPage } from "./open-portal-page";
import { PartyDisplay } from "./party";
import { VillageShopPage } from "./village-shop";

import "./dashboard.scss";

export const Dashboard = () => {
  const page = useGameUISelector(pageSelector);
  const villageId = useGameUISelector(villageSelector);
  const dispatch = useDispatch();

  const villages = useGameStateSelector(villagesSelector);

  useEffect(() => {
    if (villageId) return;
    if (!villages) return;
    if (values(villages).length === 0) return;

    dispatch(setVillage(values(villages)[0].id));
  }, [villages]);

  return (
    <>
      {villageId && <Header villageId={villageId} />}

      <div className="dashboard">
        <div className="dashboard-sidebar">
          <Parties />
          {villageId && <Village villageId={villageId} />}
        </div>

        <div className="dashboard-page">
          {page && (
            <div>{page.page === GamePageType.CharacterSheet && <CharacterSheet unitId={page.args.unitId} />}</div>
          )}
          {page && villageId && (
            <div>{page.page === GamePageType.OpenPortal && <OpenPortalPage villageId={villageId} />}</div>
          )}
          {page && villageId && (
            <div>{page.page === GamePageType.VillageShopPage && <VillageShopPage villageId={villageId} />}</div>
          )}
        </div>
      </div>
    </>
  );
};

const Parties = () => {
  const parties = useGameStateSelector(playerPartiesSelector);

  return (
    <div className="parties">
      Parties:
      <br />
      {keys(parties).map(partyId => (
        <PartyDisplay key={partyId} partyId={partyId as string} />
      ))}
    </div>
  );
};

const Village = (props: { villageId: VillageID }) => {
  const executeCommand = useGameExecuteCommand();
  const dispatch = useDispatch();
  const village = useGameStateSelector(state => villageByIdSelector(state, props.villageId));
  const villageActivities = useGameStateSelector(state => villageActivitiesSelector(state, props.villageId));

  return (
    <div className="village">
      <div>Village:</div>
      <div>
        Activities:
        {villageActivities.map(x => (
          <div>
            {x.name} - {(x.startArgs as any).targetBuilding} {(x.state as any).progress}
            <a onClick={() => executeCommand({ command: ActivityCommand.CancelActivity, args: { activityId: x.id } })}>
              [x]
            </a>
          </div>
        ))}
      </div>
      <div>House Level: {village.buildings.houses}</div>
      <div>Shop Level: {village.buildings.shop?.level || 0}</div>
      <div>Blacksmith Level: {village.buildings.blacksmith}</div>
      <div>Rune Workshop: {village.buildings.runeWorkshop}</div>
      <div>Training Field Level: {village.buildings.trainingField}</div>
      <div>Portal Summoning Stone Level: {village.buildings.portalSummoningStone?.level || 0}</div>
      <button
        onClick={() =>
          executeCommand({ command: VillageBuildingCommand.BuildShop, args: { villageId: props.villageId } })
        }
      >
        Build Shop
      </button>

      <button onClick={() => dispatch(changePage({ page: GamePageType.VillageShopPage }))}>Open Shop</button>

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
      {village && (
        <>
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
        </>
      )}
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
      <button onClick={() => dispatch(changePage({ page: GamePageType.OpenPortal }))}>Open Portal</button>
    </div>
  );
};
