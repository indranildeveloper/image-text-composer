"use client";

import { FC } from "react";
import SidebarItem from "./SidebarItem";
import { ImageIcon, TypeIcon } from "lucide-react";
import { TActiveTool } from "../types/editor";

export interface EditorSidebarProps {
  activeTool: string;
  handleChangeActiveTool: (tool: TActiveTool) => void;
}

const EditorSidebar: FC<EditorSidebarProps> = ({
  activeTool,
  handleChangeActiveTool,
}) => {
  return (
    <aside className="w-[110px] border-r p-4">
      <div className="flex flex-col gap-2">
        <SidebarItem
          icon={ImageIcon}
          label="Image"
          isActive={activeTool === "image"}
          onClick={() => handleChangeActiveTool("image")}
        />
        <SidebarItem
          icon={TypeIcon}
          label="text"
          isActive={activeTool === "text"}
          onClick={() => handleChangeActiveTool("text")}
        />
      </div>
    </aside>
  );
};

export default EditorSidebar;
