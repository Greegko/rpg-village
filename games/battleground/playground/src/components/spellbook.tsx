import { Show, createSignal } from "solid-js";

import { Position } from "@rpg-village/battleground-core";

import { Asset } from "./core";
import "./spellbook.scss";

interface SpellbookProps {
  onSpellSelectionStart(spellId: string, position: Position): void;
  onSpellSelectionPositionChange(position: Position): void;
  onSpellFinish(): void;
  onSpellSelectionCancel(): void;
}

export const SpellBook = (props: SpellbookProps) => {
  const [open, setOpen] = createSignal<boolean>(false);

  const startSpellCasting = (spellId: string) => {
    props.onSpellSelectionStart(spellId, { x: 0, y: 0 });

    const trackMouseMoveFn = (mouseEvent: MouseEvent) => {
      props.onSpellSelectionPositionChange({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    };

    const trackMouseRelease = (mouseEvent: MouseEvent) => {
      props.onSpellFinish();

      window.removeEventListener("mousemove", trackMouseMoveFn);
      window.removeEventListener("mouseup", trackMouseRelease);
      window.removeEventListener("keyup", trackKeyboardRelease);
    };

    const trackKeyboardRelease = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key !== "Escape") return;

      props.onSpellSelectionCancel();

      window.removeEventListener("mousemove", trackMouseMoveFn);
      window.removeEventListener("mouseup", trackMouseRelease);
      window.removeEventListener("keyup", trackKeyboardRelease);
    };

    window.addEventListener("mousemove", trackMouseMoveFn);
    window.addEventListener("mouseup", trackMouseRelease);
    window.addEventListener("keyup", trackKeyboardRelease);
  };

  return (
    <span class="spellbook">
      <Show when={open()}>
        <div class="spell" onClick={() => startSpellCasting("fireball")}>
          <Asset id="icons/spells/fireball" />
        </div>
        <div class="spell" onClick={() => startSpellCasting("heal")}>
          <Asset id="icons/spells/hearth" />
        </div>
        <div class="spell" onClick={() => startSpellCasting("shieldBreak")}>
          <Asset id="icons/spells/shield_break" />
        </div>
        <div class="spell" onClick={() => startSpellCasting("lightning")}>
          <Asset id="icons/spells/lightning" />
        </div>
        <div class="spell inactive">
          <Asset id="icons/spells/archer" />
        </div>
        <div class="spell inactive">
          <Asset id="icons/spells/ice_berg" />
        </div>
      </Show>

      <div class="book" onClick={() => setOpen(open => !open)}>
        <Asset id="icons/spell_book" />
      </div>
    </span>
  );
};
