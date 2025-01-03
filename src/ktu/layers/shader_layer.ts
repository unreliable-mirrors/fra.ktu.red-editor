import {
  Application,
  Container,
  FederatedPointerEvent,
  Filter,
  Point,
  Ticker,
  UniformGroup,
} from "pixi.js";

import vertex from "../shaders/defaultFilter.vert?raw";
import fragment from "../shaders/firstShader.frag?raw";
import { IEditorLayer } from "./ieditor_layer";

export class ShaderLayer implements IEditorLayer {
  parent?: Container;
  uniforms = new UniformGroup({
    u_mouse: { value: new Point(1, 1), type: "vec2<f32>" },
    u_blue: { value: 1, type: "f32" },
  });

  public constructor() {}

  bind(container: Container): void {
    const uniforms = this.uniforms;
    var shader = Filter.from({
      gl: {
        vertex: vertex,
        fragment: fragment,
      },
      resources: {
        uniforms,
      },
    });
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
    this.uniforms.uniforms.u_blue = event.clientX / this.parent!.width;
  }
}
