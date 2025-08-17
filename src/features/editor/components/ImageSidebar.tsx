import { FC, useCallback, useState } from "react";
import ToolSidebarHeader from "./ToolSidebarHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { FileUpIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Editor, TActiveTool } from "../types/editor";
import ToolSidebarClose from "./ToolSidebarClose";
import { toast } from "sonner";

export interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

const ImageSidebar: FC<ImageSidebarProps> = ({
  editor,
  activeTool,
  onChangeActiveTool,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0].type !== "image/png") {
      toast.error("Only PNG files are allowed!");
      return;
    }
    setUploadedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleImageUpload = () => {
    const reader = new FileReader();
    reader.onload = (file) => {
      const dataUrl = file.target?.result as string;
      editor?.addImage(dataUrl);
    };
    reader.readAsDataURL(uploadedFile!);
  };

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
              <div
                className="group flex h-40 cursor-pointer items-center justify-center rounded-md border border-dashed"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-muted-foreground text-sm">
                    Drop the files here ...
                  </p>
                ) : (
                  <p className="text-muted-foreground group-hover:text-primary text-center text-sm transition">
                    Drag and drop some files here, <br /> or click to select
                    files
                  </p>
                )}
              </div>
              {uploadedFile && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm">{uploadedFile.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {Math.ceil(uploadedFile.size / 1024)} KB
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  disabled={!uploadedFile}
                  onClick={() => handleImageUpload()}
                >
                  Upload
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ToolSidebarClose onClick={handleCloseToolSidebar} />
    </aside>
  );
};

export default ImageSidebar;
