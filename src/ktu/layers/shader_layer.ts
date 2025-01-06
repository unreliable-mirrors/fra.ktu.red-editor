import {
  Container,
  FederatedPointerEvent,
  Filter,
  Point,
  Ticker,
  UniformGroup,
} from "pixi.js";

import { IEditorLayer } from "./ieditor_layer";

export abstract class ShaderLayer implements IEditorLayer {
  parent?: Container;
  uniforms: UniformGroup = new UniformGroup({
    u_mouse: { value: new Point(1, 1), type: "vec2<f32>" },
    u_x: { value: 0, type: "f32" },
    u_y: { value: 0, type: "f32" },
  });

  public constructor() {}

  abstract getShader(): Filter;

  bind(container: Container): void {
    var shader = this.getShader();
    container.filters = [shader];
    this.parent = container;
  }

  unbind(): void {
    //TODO: REMOVE PROPERLY
  }

  tick(time: Ticker): void {
    //this.uniforms.uniforms.u_blue = Math.random();
  }

  pointerDown(event: FederatedPointerEvent): void {
    this.uniforms.uniforms.u_x = event.clientX / this.parent!.width;
    this.uniforms.uniforms.u_y = event.clientY / this.parent!.height;
  }

  pointerUp(event: FederatedPointerEvent): void {}
  pointerMove(event: FederatedPointerEvent): void {}
}
