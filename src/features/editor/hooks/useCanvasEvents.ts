import { useEffect } from "react";
import * as fabric from "fabric";
import { FabricObject, TEvent, TPointerEvent } from "fabric";

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectedObjects: (object: fabric.FabricObject[]) => void;
  clearSelectionCallback?: () => void;
  save: () => void;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
  save,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    const handleSelectionCreated = (
      event: Partial<TEvent<TPointerEvent>> & {
        selected: FabricObject[];
      },
    ) => {
      setSelectedObjects(event.selected);
    };

    const handleSelectionUpdated = (
      event: Partial<TEvent<TPointerEvent>> & {
        selected: FabricObject[];
      },
    ) => {
      setSelectedObjects(event.selected);
    };

    const handleSelectionCleared = () => {
      setSelectedObjects([]);
      clearSelectionCallback?.();
    };

    if (canvas) {
      canvas.on("object:added", () => save());
      canvas.on("object:removed", () => save());
      canvas.on("object:modified", () => save());
      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:updated", handleSelectionUpdated);
      canvas.on("selection:cleared", handleSelectionCleared);
    }

    return () => {
      if (canvas) {
        canvas.off("object:added", () => save());
        canvas.off("object:removed", () => save());
        canvas.off("object:modified", () => save());
        canvas.off("selection:created", handleSelectionCreated);
        canvas.off("selection:updated", handleSelectionUpdated);
        canvas.off("selection:cleared", handleSelectionCleared);
      }
    };
  }, [canvas, setSelectedObjects, clearSelectionCallback, save]);
};
