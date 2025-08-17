import * as fabric from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
export type TActiveTool = "image" | "text" | "select" | "opacity" | "fill";

export interface Editor {
  canvas: fabric.Canvas;
  addImage: (value: string) => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  selectedObjects: fabric.FabricObject[];
  changeOpacity: (value: number) => void;
  getActiveOpacity: () => number;
  changeFillColor: (value: string) => void;
  getActiveFillColor: () => string;
  changeFontWeight: (value: number) => void;
  getActiveFontWeight: () => number;
  changeFontStyle: (value: string) => void;
  getActiveFontStyle: () => string;
}
