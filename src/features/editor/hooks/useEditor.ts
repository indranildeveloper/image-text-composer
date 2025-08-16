import { useCallback, useMemo, useState } from "react";
import * as fabric from "fabric";
import { Editor } from "../types/editor";

interface BuildEditorProps {
  canvas: fabric.Canvas;
}

const buildEditor = ({ canvas }: BuildEditorProps): Editor => {
  const addToCanvas = (object: fabric.FabricObject) => {
    // centerObject(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
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
  };
};

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
      });
    }

    return undefined;
  }, [canvas]);

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
    },
    [],
  );

  return { init, editor };
};
