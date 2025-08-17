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

    let snapLineV: fabric.Line | null = null;
    let snapLineH: fabric.Line | null = null;

    function showSnapLineV(canvas: fabric.Canvas) {
      const centerX = canvas.width / 2;
      if (!snapLineV) {
        snapLineV = new fabric.Line([centerX, 0, centerX, canvas.height], {
          stroke: "#3b82f6",
          strokeWidth: 2,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          strokeDashArray: [4, 4],
        });
        canvas.add(snapLineV);
      } else {
        snapLineV.set({
          visible: true,
          x1: centerX,
          x2: centerX,
          y1: 0,
          y2: canvas.height,
        });
      }
    }

    function hideSnapLineV() {
      if (snapLineV) {
        snapLineV.set({ visible: false });
      }
    }

    function showSnapLineH(canvas: fabric.Canvas) {
      const centerY = canvas.height / 2;
      if (!snapLineH) {
        snapLineH = new fabric.Line([0, centerY, canvas.width, centerY], {
          stroke: "#3b82f6",
          strokeWidth: 2,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          strokeDashArray: [4, 4],
        });
        canvas.add(snapLineH);
      } else {
        snapLineH.set({
          visible: true,
          x1: 0,
          x2: canvas.width,
          y1: centerY,
          y2: centerY,
        });
      }
    }

    function hideSnapLineH() {
      if (snapLineH) {
        snapLineH.set({ visible: false });
      }
    }

    if (canvas) {
      canvas.on("object:added", () => save());
      canvas.on("object:removed", () => save());
      canvas.on("object:modified", () => save());
      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:updated", handleSelectionUpdated);
      canvas.on("selection:cleared", handleSelectionCleared);

      canvas.on("object:moving", (options) => {
        const snapZone = 15;
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        const objectMiddleX = options.target.left + options.target.width / 2;
        const objectMiddleY = options.target.top + options.target.height / 2;

        // Vertical snapping (center x)
        if (
          objectMiddleX > canvasCenterX - snapZone &&
          objectMiddleX < canvasCenterX + snapZone
        ) {
          showSnapLineV(canvas);
          options.target
            .set({
              left: canvasCenterX - options.target.width / 2,
            })
            .setCoords();
          setTimeout(() => hideSnapLineV(), 400);
        } else {
          hideSnapLineV();
        }

        // Horizontal snapping (center y)
        if (
          objectMiddleY > canvasCenterY - snapZone &&
          objectMiddleY < canvasCenterY + snapZone
        ) {
          showSnapLineH(canvas);
          options.target
            .set({
              top: canvasCenterY - options.target.height / 2,
            })
            .setCoords();
          setTimeout(() => hideSnapLineH(), 400);
        } else {
          hideSnapLineH();
        }

        canvas.requestRenderAll();
      });
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
