"use client";

import { FC, useCallback, useState } from "react";
import EditorNavbar from "./EditorNavbar";
import EditorSidebar from "./EditorSidebar";
import EditorToolbar from "./EditorToolbar";
import ImageSidebar from "./ImageSidebar";
import TextSidebar from "./TextSidebar";
import { TActiveTool } from "../types/editor";

const Editor: FC = () => {
  const [activeTool, setActiveTool] = useState<TActiveTool>("image");

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
      <EditorNavbar />
      <div className="flex h-[calc(100vh-70px)]">
        <EditorSidebar
          activeTool={activeTool}
          handleChangeActiveTool={handleChangeActiveTool}
        />
        <ImageSidebar
          activeTool={activeTool}
          onChangeActiveTool={handleChangeActiveTool}
        />
        <TextSidebar
          activeTool={activeTool}
          onChangeActiveTool={handleChangeActiveTool}
        />
        <main className="w-full">
          <EditorToolbar />
        </main>
      </div>
    </div>
  );
};

export default Editor;
