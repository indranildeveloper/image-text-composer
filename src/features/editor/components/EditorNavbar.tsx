"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  ImageIcon,
  MousePointerClickIcon,
  Redo2Icon,
  Undo2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Editor, TActiveTool } from "../types/editor";
import Hint from "./Hint";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface EditorNavbarProps {
  editor: Editor | undefined;
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

const EditorNavbar: FC<EditorNavbarProps> = ({
  editor,
  activeTool,
  onChangeActiveTool,
}) => {
  return (
    <nav className="flex h-[70px] items-center justify-between border-b px-8">
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <p className="text-lg font-semibold">Image Text Composer</p>
        </Link>
        <Separator orientation="vertical" className="mx-2" />
        <Hint label="Select" side="bottom">
          <Button
            variant="ghost"
            size="icon"
            className={cn(activeTool === "select" && "bg-slate-100")}
            onClick={() => onChangeActiveTool("select")}
          >
            <MousePointerClickIcon className="size-4" />
          </Button>
        </Hint>
        <Hint label="Undo" side="bottom">
          <Button
            variant="ghost"
            size="icon"
            disabled={!editor?.canUndo()}
            onClick={() => editor?.handleUndo()}
          >
            <Undo2Icon className="size-4" />
          </Button>
        </Hint>
        <Hint label="Redo" side="bottom">
          <Button
            variant="ghost"
            size="icon"
            disabled={!editor?.canRedo()}
            onClick={() => editor?.handleRedo()}
          >
            <Redo2Icon className="size-4" />
          </Button>
        </Hint>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span>Export</span>
              <DownloadIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-8">
            <DropdownMenuLabel>Export Image</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log("Download to PNG");
              }}
            >
              <ImageIcon />
              <span>Download to PNG</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default EditorNavbar;
