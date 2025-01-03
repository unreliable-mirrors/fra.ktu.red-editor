import { Container, Filter, Point, UniformGroup } from "pixi.js";
import { ILayer } from "../ilayer";

import vertex from "../shaders/defaultFilter.vert?raw";
import fragment from "../shaders/firstShader.frag?raw";

export class ShaderLayer implements ILayer {
  uniforms = new UniformGroup({
    uMouse: { value: new Point(1, 1), type: "vec2<f32>" },
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
  }

  unbind(): void {
    //TODO: REMOVE PROPERLY
  }
}
