import { useCallback, useMemo, useState } from "react";
import * as fabric from "fabric";
import { Editor } from "../types/editor";
import { ITextboxOptions } from "fabric/fabric-impl";
import { TEXT_OPTIONS } from "../constants/editor";
import { useHistory } from "./useHistory";
import { JSON_KEYS } from "../constants/history";
import { useCanvasEvents } from "./useCanvasEvents";

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
}

const buildEditor = ({
  canvas,
  selectedObjects,
  save,
  canUndo,
  canRedo,
  undo,
  redo,
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
      // @ts-expect-error this code works, types are not properly working here
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
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
    // changeFontWeight: (value: number) => {
    //   canvas.getActiveObjects().forEach((object) => {
    //     if (isTextType(object.type)) {
    //       object.set({ fontWeight: value });
    //     }
    //   });
    //   canvas.renderAll();
    // },
    // changeFontStyle: (value: string) => {
    //   canvas.getActiveObjects().forEach((object) => {
    //     if (isTextType(object.type)) {
    //       object.set({ fontStyle: value });
    //     }
    //   });
    //   canvas.renderAll();
    // },
    // changeFontLineThrough: (value: boolean) => {
    //   canvas.getActiveObjects().forEach((object) => {
    //     if (isTextType(object.type)) {
    //       object.set({ linethrough: value });
    //     }
    //   });
    //   canvas.renderAll();
    // },
    // changeFontUnderline: (value: boolean) => {
    //   canvas.getActiveObjects().forEach((object) => {
    //     if (isTextType(object.type)) {
    //       object.set({ underline: value });
    //     }
    //   });
    //   canvas.renderAll();
    // },
    // changeTextAlign: (value: ITextboxOptions["textAlign"]) => {
    //   canvas.getActiveObjects().forEach((object) => {
    //     if (isTextType(object.type)) {
    //       object.set({ textAlign: value });
    //     }
    //   });
    //   canvas.renderAll();
    // },
    // changeFontSize: (value: number) => {
    //   canvas.getActiveObjects().forEach((object) => {
    //     if (isTextType(object.type)) {
    //       object.set({ fontSize: value });
    //     }
    //   });
    //   canvas.renderAll();
    // },
    // bringForward: () => {
    //   canvas.getActiveObjects().forEach((object) => {
    //     canvas.bringObjectForward(object);
    //     canvas.renderAll();
    //     // TODO: get the image instead of the workspace
    //     // const workspace = getWorkSpace();
    //     // canvas.sendObjectToBack(workspace!);
    //   });
    // },
    // sendBackward: () => {
    //   canvas.getActiveObjects().forEach((object) => {
    //     canvas.sendObjectBackwards(object);
    //     canvas.renderAll();
    //     // TODO: get the image instead of the workspace
    //     // const workspace = getWorkSpace();
    //     // canvas.sendObjectToBack(workspace!);
    //   });
    // },
    // changeFillColor: (value: string) => {
    //   setFillColor(value);
    //   canvas.getActiveObjects().forEach((object) => {
    //     object.set({ fill: value });
    //   });

    //   canvas.renderAll();
    // },
  };
};

export const useEditor = ({ clearSelectionCallback }: UseEditorProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.FabricObject[]>(
    [],
  );

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
      });
    }

    return undefined;
  }, [canvas, selectedObjects, save, canUndo, canRedo, undo, redo]);

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
