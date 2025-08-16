import * as fabric from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
export type TActiveTool = "image" | "text" | "select";

export interface Editor {
  canvas: fabric.Canvas;
  addImage: (value: string) => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  selectedObjects: fabric.FabricObject[];
}
