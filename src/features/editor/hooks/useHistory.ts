import { useCallback, useRef, useState } from "react";
import * as fabric from "fabric";
import { JSON_KEYS } from "../constants/history";

export interface UseHistoryProps {
  canvas: fabric.Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryProps) => {
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const canvasHistory = useRef<string[]>([]);
  const skipSave = useRef<boolean>(false);

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  const save = useCallback(
    (skip = false) => {
      if (!canvas) return;

      const currentState = canvas.toObject(JSON_KEYS);
      const json = JSON.stringify(currentState);

      if (!skip && !skipSave.current) {
        canvasHistory.current.push(json);
        setHistoryIndex(canvasHistory.current.length - 1);
      }

      // TODO: save callback
    },
    [canvas],
  );

  const undo = useCallback(() => {
    if (canUndo()) {
      skipSave.current = true;
      canvas?.clear();
      canvas?.renderAll();

      const previousIndex = historyIndex - 1;
      const previousState: string | Record<string, unknown> = JSON.parse(
        canvasHistory.current[previousIndex],
      );

      canvas
        ?.loadFromJSON(previousState)
        .then(() => {
          canvas.renderAll();
          setHistoryIndex(previousIndex);
          skipSave.current = false;
        })
        .catch((error) => {
          console.error("Error while undoing:", error);
        });
    }
  }, [canUndo, canvas, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo()) {
      skipSave.current = true;
      canvas?.clear();
      canvas?.renderAll();

      const nextIndex = historyIndex + 1;
      const nextState: string | Record<string, unknown> = JSON.parse(
        canvasHistory.current[nextIndex],
      );

      canvas
        ?.loadFromJSON(nextState)
        .then(() => {
          canvas.renderAll();
          setHistoryIndex(nextIndex);
          skipSave.current = false;
        })
        .catch((error) => {
          console.error("Error while undoing:", error);
        });
    }
  }, [canRedo, canvas, historyIndex]);

  return { save, canUndo, canRedo, undo, redo, setHistoryIndex, canvasHistory };
};
