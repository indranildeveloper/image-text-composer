"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import EditorNavbar from "./EditorNavbar";
import EditorSidebar from "./EditorSidebar";
import EditorToolbar from "./EditorToolbar";
import ImageSidebar from "./ImageSidebar";
import TextSidebar from "./TextSidebar";
import { TActiveTool } from "../types/editor";
import { useEditor } from "../hooks/useEditor";
import { SELECTION_DEPENDENT_TOOLS } from "../constants/tools";
import OpacitySidebar from "./OpacitySidebar";

const Editor: FC = () => {
  const [activeTool, setActiveTool] = useState<TActiveTool>("image");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClearSelection = useCallback(() => {
    if (SELECTION_DEPENDENT_TOOLS.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    clearSelectionCallback: handleClearSelection,
  });

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({ initialCanvas: canvas, initialContainer: containerRef.current! });

    return () => {
      canvas.dispose().catch((error) => {
        console.error("Canvas Error: ", error);
      });
    };
  }, [init]);

  const handleChangeActiveTool = useCallback(
    (tool: TActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }

      setActiveTool(tool);
    },
    [activeTool],
  );

  return (
    <div className="flex h-screen flex-col">
      <EditorNavbar
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={handleChangeActiveTool}
      />
      <div className="flex h-[calc(100vh-70px)]">
        <EditorSidebar
          activeTool={activeTool}
          handleChangeActiveTool={handleChangeActiveTool}
        />
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={handleChangeActiveTool}
        />
        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={handleChangeActiveTool}
        />
        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={handleChangeActiveTool}
        />
        <main className="w-full">
          <EditorToolbar
            key={JSON.stringify(editor?.canvas?.getActiveObject())}
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={handleChangeActiveTool}
          />
          <div ref={containerRef} className="h-[calc(100vh-120px)] flex-1">
            <canvas ref={canvasRef} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Editor;
