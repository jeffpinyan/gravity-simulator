import { createContext, useCallback, useState } from "react";

export const MouseContext = createContext({});

export const MouseProvider = ({ render=null, children=null }) => {
    const mouse = useMouse();

    return <MouseContext.Provider value={mouse}>
        {render ? render(mouse) : children}
    </MouseContext.Provider>;
};

export const useMouse = () => {
    const [ XY, setXY ] = useState([ null, null ]);
    const [ offsetXY, setOffsetXY ] = useState([ null, null ]);
    const [ buttons, setButtons ] = useState(0);
    const update = useCallback((ev) => {
        setXY([ ev.pageX, ev.pageY ]);
        setOffsetXY([ ev.nativeEvent.offsetX, ev.nativeEvent.offsetY ]);
        setButtons(ev.buttons);
    }, [setXY, setOffsetXY, setButtons]);

    return {
        X: XY[0],
        Y: XY[1],
        XY,

        offsetX: offsetXY[0],
        offsetY: offsetXY[1],
        offsetXY,

        buttons,
        buttonLeft: buttons & 1,
        buttonRight: buttons & 2,

        update,
    };
};

export const withMouse = (Component) => ({ ...props }) => {
    const mouse = useMouse();
    return <Component {...props} mouse={mouse}/>
};