import {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Vector2 } from "../classes/Vector/Vector2";

type MouseProviderProps = {
  render?: Function;
  children?: ReactNode;
  withMouseMove?: boolean;
  withLeftClick?: boolean;
  withRightClick?: boolean;
};

type MouseEvents = Record<string, MouseEventHandler>;

export type MouseContextType = {
  xy: Vector2;
  x: number;
  y: number;
  offset: Vector2;
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
  const [XY, setXY] = useState<Vector2>(null!);
  const [offsetXY, setOffsetXY] = useState<Vector2>(null!);
  const [buttons, setButtons] = useState<number>(0);
  const update: MouseEventHandler = useCallback(
    (ev: MouseEvent) => {
      setXY(new Vector2(ev.pageX, ev.pageY));
      setOffsetXY(new Vector2(ev.nativeEvent.offsetX, ev.nativeEvent.offsetY));
      setButtons(ev.buttons);
    },
    [setXY, setOffsetXY, setButtons]
  );

  return {
    xy: XY,
    x: XY?.x,
    y: XY?.y,
    offset: offsetXY,
    offsetX: offsetXY?.x,
    offsetY: offsetXY?.y,
    buttons,
    buttonLeft: buttons & 1,
    buttonRight: buttons & 2,
    update,
  };
}
