import { useCallback, useRef } from "react";
import * as fabric from "fabric";

interface UseClipboardProps {
  canvas: fabric.Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
  const clipboard = useRef<fabric.FabricObject>(null);

  const copy = useCallback(() => {
    canvas
      ?.getActiveObject()
      ?.clone()
      .then((cloned) => {
        clipboard.current = cloned;
      })
      .catch((error) => {
        console.error("Something went wrong while copying the element!", error);
      });
  }, [canvas]);

  const paste = useCallback(() => {
    if (!clipboard.current) return;

    clipboard.current
      .clone()
      .then((clonedObj: fabric.FabricObject) => {
        canvas?.discardActiveObject();
        clonedObj.set({
          top: clonedObj.top + 10,
          left: clonedObj.left + 10,
          evented: true,
        });

        if (clonedObj.type === "activeSelection") {
          clonedObj.canvas = canvas ?? undefined;
          // @ts-expect-error This is good
          clonedObj.forEachObject((obj: fabric.FabricObject) => {
            canvas?.add(obj);
          });
          clonedObj.setCoords();
        } else {
          canvas?.add(clonedObj);
        }

        if (clipboard.current) {
          clipboard.current.top += 10;
          clipboard.current.left += 10;
        }
        canvas?.setActiveObject(clonedObj);
        canvas?.requestRenderAll();
      })
      .catch((error) => {
        console.error("Something went wrong while pasting the element!", error);
      });
  }, [canvas]);

  return { copy, paste };
};
