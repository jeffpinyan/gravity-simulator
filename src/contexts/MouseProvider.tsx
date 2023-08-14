import {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

type MouseProviderProps = {
  render?: Function;
  children?: ReactNode;
  withMouseMove?: boolean;
  withLeftClick?: boolean;
  withRightClick?: boolean;
};

type MouseEvents = Record<string, MouseEventHandler>;

type MouseContextType = {
  X: number;
  Y: number;
  offsetX: number;
  offsetY: number;
  buttons: number;
  buttonLeft: number;
  buttonRight: number;
  update: MouseEventHandler;
};

export const MouseContext = createContext<MouseContextType>(
  {} as MouseContextType
);

export function MouseProvider({
  render,
  children,
  withMouseMove = true,
  withLeftClick = true,
  withRightClick = true,
}: MouseProviderProps) {
  const mouse = useMouse();
  const props: MouseEvents = useMemo(
    () => ({
      ...(withMouseMove ? { onMouseMove: mouse.update } : {}),
      ...(withLeftClick ? { onClick: () => null } : {}),
      ...(withRightClick ? { onContextMenu: () => null } : {}),
    }),
    [mouse.update, withMouseMove, withLeftClick, withRightClick]
  );

  return (
    <MouseContext.Provider value={mouse}>
      <div {...props}>{render ? render(mouse) : children}</div>
    </MouseContext.Provider>
  );
}

export function useMouse(): MouseContextType {
  const [XY, setXY] = useState<[number, number]>([null!, null!]);
  const [offsetXY, setOffsetXY] = useState<[number, number]>([null!, null!]);
  const [buttons, setButtons] = useState<number>(0);
  const update: MouseEventHandler = useCallback(
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
    offsetX: offsetXY[0],
    offsetY: offsetXY[1],
    buttons,
    buttonLeft: buttons & 1,
    buttonRight: buttons & 2,
    update,
  };
}
