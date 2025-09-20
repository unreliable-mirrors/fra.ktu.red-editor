import { ILayer } from "../../engine/ilayer";

export type EditorLayerState = {
  name: string;
  layerId: number;
  visible: boolean;
  modulators: { field: string; modulatorId: number }[];
};

export type EditorLayerSetting = {
  field: string;
  type: string;
  values?: string[];
  onchange: (value: string) => void;
};

export interface IEditorLayer extends ILayer {
  active: boolean;
  state: EditorLayerState;
  settings: EditorLayerSetting[];
  absorbingLayer: boolean;
  pointerDown(event: PointerEvent): void;
  pointerUp(event: PointerEvent): void;
  pointerMove(event: PointerEvent): void;
}
