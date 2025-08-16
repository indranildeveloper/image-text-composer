"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DownloadIcon, ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EditorNavbar: FC = () => {
  return (
    <nav className="flex h-[70px] items-center justify-between border-b px-8">
      <div>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={30} height={30} />
          <p className="text-lg font-semibold">Image Text Composer</p>
        </Link>
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
