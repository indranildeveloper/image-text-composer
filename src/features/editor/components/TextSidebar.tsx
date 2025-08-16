import { FC } from "react";
import { cn } from "@/lib/utils";
import ToolSidebarHeader from "./ToolSidebarHeader";
import { Editor, TActiveTool } from "../types/editor";
import ToolSidebarClose from "./ToolSidebarClose";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export interface TextSidebarProps {
  editor: Editor | undefined;
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

const TextSidebar: FC<TextSidebarProps> = ({
  editor,
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

      <ScrollArea>
        <div className="mt-3 space-y-4">
          <Button
            variant="secondary"
            size="lg"
            className="h-16 w-full"
            onClick={() =>
              editor?.addText("Heading", {
                fontSize: 80,
                fontWeight: 700,
              })
            }
          >
            <span className="text-3xl font-bold">Add a Heading</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="h-14 w-full"
            onClick={() =>
              editor?.addText("Subheading", {
                fontSize: 44,
                fontWeight: 600,
              })
            }
          >
            <span className="text-xl font-semibold">Add a Subheading</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="h-10 w-full"
            onClick={() =>
              editor?.addText("Paragraph", {
                fontSize: 32,
              })
            }
          >
            <span className="text-base font-bold">Add a Paragraph</span>
          </Button>
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={handleCloseToolSidebar} />
    </aside>
  );
};

export default TextSidebar;
