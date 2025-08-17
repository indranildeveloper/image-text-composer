import { FC } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarHeader from "./ToolSidebarHeader";
import ToolSidebarClose from "./ToolSidebarClose";
import ColorPicker from "./ColorPicker";
import { FILL_COLOR } from "../constants/editor";
import { Editor, TActiveTool } from "../types/editor";

interface FillColorSidebarProps {
  editor: Editor | undefined;
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

const FillColorSidebar: FC<FillColorSidebarProps> = ({
  editor,
  activeTool,
  onChangeActiveTool,
}) => {
  const colorValue = editor?.getActiveFillColor() ?? FILL_COLOR;

  const handleCloseToolSidebar = () => {
    onChangeActiveTool("select");
  };

  const handleChange = (value: string) => {
    editor?.changeFillColor(value);
  };

  return (
    <aside
      className={cn(
        "relative z-40 flex h-full w-[360px] flex-col border-r bg-white p-4",
        activeTool === "fill" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Fill Color"
        description="Add fill color to your element."
      />

      <ScrollArea className="mt-2 h-[calc(100vh-150px)]">
        <div className="space-y-6">
          <ColorPicker value={colorValue} onChange={handleChange} />
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={handleCloseToolSidebar} />
    </aside>
  );
};

export default FillColorSidebar;
