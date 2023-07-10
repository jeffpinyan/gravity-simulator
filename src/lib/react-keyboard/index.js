import { useCallback, useState } from "react";

export const useKeyboard = () => {
    const [ event, setEvent ] = useState({});
    const update = useCallback((ev) => {
        ev.preventDefault();
        ev.persist();
        setEvent(ev);
    }, [setEvent]);

    return {
        event,
        type: event.type,
        ctrl: event.ctrlKey && 'ctrl',
        shift: event.shiftKey && 'shift',
        alt: event.altKey && 'alt',
        key: event.key,
        code: event.keyCode,
        update,
    };
}