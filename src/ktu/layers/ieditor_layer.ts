import { FederatedPointerEvent } from "pixi.js";
import { ILayer } from "../../engine/ilayer";

export interface IEditorLayer extends ILayer {
  pointerDown(event: FederatedPointerEvent): void;
  pointerUp(event: FederatedPointerEvent): void;
  pointerMove(event: FederatedPointerEvent): void;
}
