import { FC } from "react";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./ToolSidebarHeader";
import { TActiveTool } from "../types/editor";
import ToolSidebarClose from "./ToolSidebarClose";

export interface TextSidebarProps {
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

const TextSidebar: FC<TextSidebarProps> = ({
  activeTool,
  onChangeActiveTool,
}) => {
  const handleCloseToolSidebar = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative w-[400px] border-r px-4 py-3",
        activeTool === "text" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader title="Text" description="Add Text elements." />
      <ToolSidebarClose onClick={handleCloseToolSidebar} />
    </aside>
  );
};

export default TextSidebar;
