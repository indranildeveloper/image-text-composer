import { FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSidebarHeader from "./ToolSidebarHeader";
import ToolSidebarClose from "./ToolSidebarClose";
import { Button } from "@/components/ui/button";
import { Editor, TActiveTool } from "../types/editor";
import { localFonts } from "../constants/fonts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FontFamilySidebarProps {
  editor: Editor | undefined;
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

interface GoogleFontWebfont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: { [variant: string]: string };
  category: string;
  kind: string;
  menu: string;
}

interface GoogleFontsWebfontList {
  kind: string;
  items: GoogleFontWebfont[];
}

const FontFamilySidebar: FC<FontFamilySidebarProps> = ({
  editor,
  activeTool,
  onChangeActiveTool,
}) => {
  const currentFontFamilyValue = editor?.getActiveFontFamily();

  const [fonts, setFonts] = useState<GoogleFontWebfont[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY}`,
    )
      .then((res) => res.json())
      .then((data: GoogleFontsWebfontList) => setFonts(data.items))
      .catch((error) => {
        console.error("Error fetching fonts:", error);
      });
  }, []);

  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }
    setIsSuggestionsOpen(true);
    setSuggestions(
      fonts
        .map((f) => f.family)
        .filter((font) => font.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10),
    );
  }, [query, fonts]);

  const loadFontUsingFontFaceAPI = async (fontFamily: string) => {
    const fontObj = fonts.find((f) => f.family === fontFamily);
    if (!fontObj) return;

    const fontUrl = fontObj.files["regular"] || Object.values(fontObj.files)[0];

    if (!fontUrl) return;

    try {
      const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
      document.fonts.add(fontFace);
      await fontFace.load();
    } catch (error) {
      console.error("Failed to load font", error);
    }
  };

  const handleSelect = (font: string) => {
    setQuery(font);
    loadFontUsingFontFaceAPI(font)
      .then(() => {
        setSuggestions([]);
        editor?.changeFontFamily(font);
      })
      .catch((error) => {
        console.error("Failed to load font", error);
      });
  };

  const handleCloseToolSidebar = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "relative z-40 flex h-full w-[360px] flex-col border-r bg-white p-4",
        activeTool === "font" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader title="Font" description="Modify the font family." />

      <div className="mt-3">
        <div className="flex flex-col gap-1">
          <div className="flex w-full flex-col gap-1">
            <Label htmlFor="fonts">Search Google Fonts</Label>
            <Input
              id="fonts"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Google Fonts"
            />
            {suggestions.length > 0 && isSuggestionsOpen && (
              <ul className="mt-2 flex flex-col rounded-md border p-2 shadow">
                {suggestions.map((font) => (
                  <li
                    key={font}
                    onClick={() => handleSelect(font)}
                    className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
                  >
                    {font}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h2>Local Fonts</h2>
        <ScrollArea className="mt-2 h-[calc(100vh-400px)] pr-4">
          <div className="space-y-2">
            {localFonts.map((font) => (
              <Button
                key={font}
                variant="secondary"
                size="lg"
                className={cn(
                  "h-12 w-full cursor-pointer justify-start px-4 py-2 text-left",
                  currentFontFamilyValue === font && "border-primary border-2",
                )}
                style={{
                  fontFamily: font,
                }}
                onClick={() => editor?.changeFontFamily(font)}
              >
                {font}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <ToolSidebarClose onClick={handleCloseToolSidebar} />
    </aside>
  );
};

export default FontFamilySidebar;
