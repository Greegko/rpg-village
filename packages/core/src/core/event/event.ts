import { EventType } from "@rpg-village/core/extend";

type EventBase<T extends keyof EventType> = T extends string
  ? EventType[T] extends undefined
    ? { event: T }
    : { event: T; args: EventType[T] }
  : never;

export type Event = EventBase<keyof EventType>;
