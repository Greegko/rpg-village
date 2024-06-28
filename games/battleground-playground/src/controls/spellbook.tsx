import { createSignal,  useContext } from "solid-js";

import { Asset, LoopContext } from "./core";

import "./spellbook.scss";

export const SpellBook = () => {
  const [open, setOpen] = createSignal<boolean>(false);

  const loop = useContext(LoopContext);

  const startSpellCasting = (spellId: string) => {
    loop.spellSelection.startSpellSelection(spellId, { x: 0, y: 0 });

    const trackMouseMoveFn = (mouseEvent: MouseEvent) => {
      loop.spellSelection.setSpellPosition({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    };

    const trackMouseRelease = (mouseEvent: MouseEvent) => {
      loop.spellSelection.stopSpellSelection(true);

      window.removeEventListener("mousemove", trackMouseMoveFn);
      window.removeEventListener("mouseup", trackMouseRelease);
      window.removeEventListener("keyup", trackKeyboardRelease);
    };

    const trackKeyboardRelease = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key !== "Escape") return;

      loop.spellSelection.stopSpellSelection(false);

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
      {open() && (
        <>
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
        </>
      )}

      <div class="book" onClick={() => setOpen(open => !open)}>
        <Asset id="icons/spell_book" />
      </div>
    </span>
  );
};
