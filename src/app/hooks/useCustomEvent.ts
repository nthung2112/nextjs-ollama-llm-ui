import { useEffect } from "react";

export interface CustomEvents {
  "reset-chat": {
    chatId: string;
  };
}

export function useEventListener<T extends keyof CustomEvents>(
  eventName: T,
  handler: (detail: CustomEvents[T]) => void
) {
  useEffect(() => {
    const eventHandler = (event: CustomEvent<CustomEvents[T]>) => {
      handler(event.detail);
    };

    document.addEventListener(eventName, eventHandler as EventListener);
    return () => {
      document.removeEventListener(eventName, eventHandler as EventListener);
    };
  }, [eventName, handler]);
}

export const triggerCustomEvent = <EventName extends keyof CustomEvents>(
  eventName: EventName,
  data: CustomEvents[EventName]
) => {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
};
