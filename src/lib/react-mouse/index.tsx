import {
  MouseEvent,
  ReactNode,
  createContext,
  useCallback,
  useState,
} from "react";

type NumberOrNull = number | null;

// type ComponentWithMouse = ComponentType & { mouse: any };

export const MouseContext = createContext({});

export const MouseProvider = ({
  render = null,
  children = null,
}: {
  render: Function | null;
  children: ReactNode;
}) => {
  const mouse = useMouse();

  return (
    <MouseContext.Provider value={mouse}>
      {render ? render(mouse) : children}
    </MouseContext.Provider>
  );
};

export const useMouse = () => {
  const [XY, setXY] = useState<[NumberOrNull, NumberOrNull]>([null, null]);
  const [offsetXY, setOffsetXY] = useState<[NumberOrNull, NumberOrNull]>([
    null,
    null,
  ]);
  const [buttons, setButtons] = useState<number>(0);
  const update = useCallback(
    (ev: MouseEvent) => {
      setXY([ev.pageX, ev.pageY]);
      setOffsetXY([ev.nativeEvent.offsetX, ev.nativeEvent.offsetY]);
      setButtons(ev.buttons);
    },
    [setXY, setOffsetXY, setButtons]
  );

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

// export const withMouse = (Comp: ComponentWithMouse) => ({ ...props }) => {
//   const mouse = useMouse();
//   return <Comp {...props} mouse={mouse} />;
// };
