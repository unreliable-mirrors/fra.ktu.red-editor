import { FederatedPointerEvent } from "pixi.js";
import { ILayer } from "../../engine/ilayer";

export type EditorLayerState = {
  name: string;
  layerId: string;
  [key: string]: any;
};

export interface IEditorLayer extends ILayer {
  state: EditorLayerState;
  pointerDown(event: FederatedPointerEvent): void;
  pointerUp(event: FederatedPointerEvent): void;
  pointerMove(event: FederatedPointerEvent): void;
}
