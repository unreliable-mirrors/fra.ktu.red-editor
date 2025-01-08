import { FederatedPointerEvent } from "pixi.js";
import { ILayer } from "../../engine/ilayer";

export type EditorLayerState = {
  name: string;
  layerId: string;
  [key: string]: any;
};

export type EditorLayerSetting = {
  field: string;
  type: string;
  onchange: (value: string) => void;
};

export interface IEditorLayer extends ILayer {
  active: boolean;
  state: EditorLayerState;
  settings: EditorLayerSetting[];
  pointerDown(event: FederatedPointerEvent): void;
  pointerUp(event: FederatedPointerEvent): void;
  pointerMove(event: FederatedPointerEvent): void;
}
