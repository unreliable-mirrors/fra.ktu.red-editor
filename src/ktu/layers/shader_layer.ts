import {
  Container,
  FederatedPointerEvent,
  Filter,
  Point,
  Ticker,
  UniformGroup,
} from "pixi.js";

import { EditorLayerSetting, IEditorLayer } from "./ieditor_layer";
import { getSecureIndex } from "../scenes/editor_scene";

export abstract class ShaderLayer implements IEditorLayer {
  layerId: number;
  parent?: Container;
  uniforms: UniformGroup = new UniformGroup({
    u_mouse: { value: new Point(1, 1), type: "vec2<f32>" },
    u_x: { value: 0, type: "f32" },
    u_y: { value: 0, type: "f32" },
  });
  abstract state: { name: string; layerId: number; [key: string]: any };
  abstract settings: EditorLayerSetting[];
  active: boolean;

  public constructor() {
    //TODO: REPLACE THIS FOR A GLOBAL SAFE COUNTER
    this.layerId = getSecureIndex();
    this.active = false;
  }

  abstract getShader(): Filter;

  bind(container: Container): void {
    var shader = this.getShader();
    container.filters = [shader];
    this.parent = container;
  }

  unbind(): void {
    //TODO: REMOVE PROPERLY
  }

  //@ts-ignore
  tick(time: Ticker): void {
    //this.uniforms.uniforms.u_blue = Math.random();
  }

  pointerDown(event: FederatedPointerEvent): void {
    this.uniforms.uniforms.u_x = event.clientX / this.parent!.width;
    this.uniforms.uniforms.u_y = event.clientY / this.parent!.height;
  }

  //@ts-ignore
  pointerUp(event: FederatedPointerEvent): void {}
  //@ts-ignore
  pointerMove(event: FederatedPointerEvent): void {}
}
