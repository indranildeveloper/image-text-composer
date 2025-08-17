import { useCallback, useMemo, useState } from "react";
import * as fabric from "fabric";
import { Editor } from "../types/editor";
import { ITextboxOptions } from "fabric/fabric-impl";
import {
  DEFAULT_EDITOR_STATE,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_LINE_THROUGH,
  FONT_SIZE,
  FONT_STYLE,
  FONT_UNDERLINE,
  FONT_WEIGHT,
  TEXT_ALIGN,
  TEXT_OPTIONS,
} from "../constants/editor";
import { useHistory } from "./useHistory";
import { JSON_KEYS } from "../constants/history";
import { useCanvasEvents } from "./useCanvasEvents";
import { isTextType } from "../utils/text";
import { downloadFile } from "../utils/download";
import { useClipboard } from "./useClipboard";
import { useShortcuts } from "./useShortcuts";
import { useWindowEvents } from "./useWindowEvents";

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
  copy: () => void;
  paste: () => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
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
  fontFamily,
  setFontFamily,
  copy,
  paste,
}: BuildEditorProps): Editor => {
  const getWorkSpace = () => {
    return (
      canvas
        .getObjects()
        // @ts-expect-error name is assigned
        .find((object) => object.name === "image")
    );
  };

  const addToCanvas = (object: fabric.FabricObject) => {
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  const generateSaveOptions = () => {
    return {
      name: "Image",
      format: "png" as fabric.ImageFormat,
      quality: 1,
      multiplier: 1,
    };
  };

  const savePNG = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "png");
  };

  const loadJSON = (json: string) => {
    const data: string | Record<string, unknown> = JSON.parse(json);
    console.log(data);
    canvas
      .loadFromJSON(data)
      .then(() => canvas.renderAll())
      .catch((error) => {
        console.error("Something went wrong while loading the file!", error);
      });
  };

  return {
    canvas,
    selectedObjects,
    handleUndo: () => undo(),
    handleRedo: () => redo(),
    canUndo: () => canUndo(),
    canRedo: () => canRedo(),
    savePNG: () => savePNG(),
    copyObject: () => copy(),
    pasteObject: () => paste(),
    resetEditor: () => {
      canvas
        ?.loadFromJSON(JSON.parse(DEFAULT_EDITOR_STATE) as string)
        .then(() => {
          canvas.renderAll();
        })
        .catch((error) => {
          console.error(
            "Something went wrong while resetting the editor!",
            error,
          );
        });
    },
    loadJSON: (json: string) => loadJSON(json),
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
            name: "image",
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
    changeFontLineThrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLineThrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_LINE_THROUGH;
      }

      const value = selectedObject.get("linethrough") || FONT_LINE_THROUGH;
      return value as boolean;
    },
    changeTextAlign: (value: ITextboxOptions["textAlign"]) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return TEXT_ALIGN;
      }

      const value = selectedObject.get("textAlign") || TEXT_ALIGN;
      return value as ITextboxOptions["textAlign"];
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      const value = selectedObject.get("fontSize") || FONT_SIZE;
      return value as number;
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontFamily: value });
        }
      });

      canvas.renderAll();
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fontFamily;
      }

      const value = selectedObject.get("fontFamily") || fontFamily;
      return value as string;
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringObjectForward(object);
        canvas.renderAll();

        const workspace = getWorkSpace();
        canvas.sendObjectToBack(workspace!);
      });
    },
    sendBackward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendObjectBackwards(object);
        canvas.renderAll();

        const workspace = getWorkSpace();
        canvas.sendObjectToBack(workspace!);
      });
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
  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);

  const { save, canUndo, canRedo, undo, redo, canvasHistory, setHistoryIndex } =
    useHistory({ canvas });

  useCanvasEvents({ canvas, setSelectedObjects, clearSelectionCallback, save });

  const { copy, paste } = useClipboard({ canvas });

  useShortcuts({
    canvas,
    undo,
    redo,
    save,
    copy,
    paste,
  });

  useWindowEvents();

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
        fontFamily,
        setFontFamily,
        copy,
        paste,
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
    copy,
    paste,
    fontFamily,
    setFontFamily,
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
