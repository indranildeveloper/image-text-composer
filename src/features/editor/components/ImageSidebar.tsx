import { FC } from "react";
import ToolSidebarHeader from "./ToolSidebarHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileUpIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TActiveTool } from "../types/editor";
import ToolSidebarClose from "./ToolSidebarClose";

export interface ImageSidebarProps {
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

const ImageSidebar: FC<ImageSidebarProps> = ({
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
        activeTool === "image" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Images"
        description="Add Images to your canvas."
      />
      <div className="mt-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <FileUpIcon />
              <span>Upload Image</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>Upload only PNG Images.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {/* TODO: Drag and drop */}
              <Label htmlFor="picture">Image</Label>
              <Input id="picture" type="file" />
            </div>
            <DialogFooter>
              <Button onClick={() => {}}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ToolSidebarClose onClick={handleCloseToolSidebar} />
    </aside>
  );
};

export default ImageSidebar;
