import { Container, FederatedPointerEvent, Filter, Ticker } from "pixi.js";

import {
  EditorLayerSetting,
  EditorLayerState,
  IEditorLayer,
} from "../layers/ieditor_layer";
import { getSecureIndex } from "../scenes/editor_scene";

export type ShaderState = EditorLayerState;

export abstract class ShaderLayer implements IEditorLayer {
  layerId: number;
  abstract state: ShaderState;
  abstract settings: EditorLayerSetting[];
  active: boolean;
  abstract shader: Filter;

  public constructor() {
    this.layerId = getSecureIndex();
    this.active = false;
  }

  abstract buildShader(): Filter;

  //@ts-ignore
  bind(container: Container): void {}

  unbind(): void {
    //TODO: REMOVE PROPERLY
  }

  //@ts-ignore
  tick(time: Ticker): void {}

  //@ts-ignore
  pointerDown(event: FederatedPointerEvent): void {}

  //@ts-ignore
  pointerUp(event: FederatedPointerEvent): void {}
  //@ts-ignore
  pointerMove(event: FederatedPointerEvent): void {}
}
