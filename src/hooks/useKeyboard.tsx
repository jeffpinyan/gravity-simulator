import { SyntheticEvent, useCallback, useState } from "react";

export const useKeyboard = () => {
  const [event, setEvent] = useState<KeyboardEvent>(null!);
  const update = useCallback(
    (ev: SyntheticEvent) => {
      ev.preventDefault();
      ev.persist();
      setEvent((ev as unknown) as KeyboardEvent);
    },
    [setEvent]
  );

  return {
    event,
    type: event.type,
    ctrl: event.ctrlKey && "ctrl",
    shift: event.shiftKey && "shift",
    alt: event.altKey && "alt",
    key: event.key,
    code: event.keyCode,
    update,
  };
};
