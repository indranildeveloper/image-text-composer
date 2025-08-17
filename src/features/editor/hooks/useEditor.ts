import { useCallback, useMemo, useState } from "react";
import * as fabric from "fabric";
import { Editor } from "../types/editor";
import { ITextboxOptions } from "fabric/fabric-impl";
import {
  FILL_COLOR,
  FONT_STYLE,
  FONT_UNDERLINE,
  FONT_WEIGHT,
  TEXT_OPTIONS,
} from "../constants/editor";
import { useHistory } from "./useHistory";
import { JSON_KEYS } from "../constants/history";
import { useCanvasEvents } from "./useCanvasEvents";
import { isTextType } from "../utils/text";

interface UseEditorProps {
  clearSelectionCallback?: () => void;
}

interface BuildEditorProps {
  canvas: fabric.Canvas;
  selectedObjects: fabric.FabricObject[];
  save: (skip?: boolean) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
  fillColor: string;
  setFillColor: (value: string) => void;
}

const buildEditor = ({
  canvas,
  selectedObjects,
  save,
  canUndo,
  canRedo,
  undo,
  redo,
  fillColor,
  setFillColor,
}: BuildEditorProps): Editor => {
  const addToCanvas = (object: fabric.FabricObject) => {
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    canvas,
    selectedObjects,
    handleUndo: () => undo(),
    handleRedo: () => redo(),
    canUndo: () => canUndo(),
    canRedo: () => canRedo(),
    addImage: (value: string) => {
      fabric.FabricImage.fromURL(value, { crossOrigin: "anonymous" })
        .then((image) => {
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;

          // Get image natural size
          const originalWidth = image.width;
          const originalHeight = image.height;

          // Calculate scale
          const scale = Math.min(
            canvasWidth / originalWidth,
            canvasHeight / originalHeight,
          );

          // Preserve aspect ratio
          image.set({
            scaleX: scale,
            scaleY: scale,
            left: (canvasWidth - originalWidth * scale) / 2,
            top: (canvasHeight - originalHeight * scale) / 2,
            selectable: false,
            hasControls: false,
          });
          addToCanvas(image);
        })
        .catch((error) => {
          console.error("FabricImage Error: ", error);
        });
    },
    addText: (value: string, options?: ITextboxOptions) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        // @ts-expect-error fill color is a string
        fill: fillColor,
        ...options,
      });

      addToCanvas(object);
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }

      const value = selectedObject.get("opacity") || 1;
      return value as number;
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });

      canvas.renderAll();
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fillColor;
      }

      const value = selectedObject.get("fill") || fillColor;
      // Currently, Gradients and patterns are not supported
      return value as string;
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_WEIGHT;
      }

      const value = selectedObject.get("fontWeight") || FONT_WEIGHT;
      return value as number;
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_STYLE;
      }

      const value = selectedObject.get("fontStyle") || FONT_STYLE;
      return value as string;
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_UNDERLINE;
      }

      const value = selectedObject.get("underline") || FONT_UNDERLINE;
      return value as boolean;
    },
  };
};

export const useEditor = ({ clearSelectionCallback }: UseEditorProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.FabricObject[]>(
    [],
  );
  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);

  const { save, canUndo, canRedo, undo, redo, canvasHistory, setHistoryIndex } =
    useHistory({ canvas });

  useCanvasEvents({ canvas, setSelectedObjects, clearSelectionCallback, save });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        selectedObjects,
        save,
        canUndo,
        canRedo,
        undo,
        redo,
        fillColor,
        setFillColor,
      });
    }

    return undefined;
  }, [
    canvas,
    selectedObjects,
    save,
    canUndo,
    canRedo,
    undo,
    redo,
    fillColor,
    setFillColor,
  ]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      // Set the control styles
      fabric.InteractiveFabricObject.ownDefaults = {
        ...fabric.InteractiveFabricObject.ownDefaults,
        cornerColor: "#fff",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      };

      initialCanvas.setDimensions({
        width: initialContainer.offsetWidth,
        height: initialContainer.offsetHeight,
      });

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const currentState = JSON.stringify(initialCanvas.toObject(JSON_KEYS));

      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    [canvasHistory, setHistoryIndex],
  );

  return { init, editor };
};
