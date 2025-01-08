import { Container, FederatedPointerEvent, Filter, Ticker } from "pixi.js";

import { EditorLayerSetting, IEditorLayer } from "../layers/ieditor_layer";
import { getSecureIndex } from "../scenes/editor_scene";

export abstract class ShaderLayer implements IEditorLayer {
  layerId: number;
  abstract state: { name: string; layerId: number; [key: string]: any };
  abstract settings: EditorLayerSetting[];
  active: boolean;
  shader: Filter;

  public constructor() {
    //TODO: REPLACE THIS FOR A GLOBAL SAFE COUNTER
    this.layerId = getSecureIndex();
    this.active = false;

    this.shader = this.buildShader();
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
