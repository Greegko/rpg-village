import { values } from "ramda";
import { connect } from "react-redux";
import { Unit, UnitID } from "@rpg-village/core";
import { ExecuteCommand, GameStoreState, heroUnitsSelector } from "../../game";

interface CharacterSheetProperties {
  unitId: UnitID;
}

const propertyMapper = (state: GameStoreState, props: CharacterSheetProperties): CharacterSheetState => ({
  unit: values(heroUnitsSelector(state.game)).find(({ id }) => id === props.unitId)!,
});

interface CharacterSheetState {
  unit: Unit;
}

export const CharacterSheet = connect(
  propertyMapper,
  ExecuteCommand,
)(({ unit, executeCommand }: CharacterSheetState & ExecuteCommand) => (
  <>
    <div>Character Sheet</div>
    <div>{unit.name}</div>
  </>
));
