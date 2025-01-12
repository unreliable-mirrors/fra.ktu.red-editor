import { Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./dots_shader.frag?raw";
import { ILayer } from "../../../engine/ilayer";

export type DotsShaderState = ShaderState & {
  size: number;
};

export type DotsShaderSetting = {
  field: "size";
  type: "integer";
  onchange: (value: string) => void;
};

export class DotsShader extends ShaderLayer {
  static SHADER_NAME: string = "dots_shader";
  declare state: DotsShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: DotsShaderSetting[] = [
    {
      field: "size",
      type: "integer",
      onchange: (value) => {
        this.state.size = parseInt(value);
        this.uniforms.uniforms.uPixelSize = this.state.size;
        this.refreshSize();
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: DotsShaderState) {
    super();
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        size: state.size,
      };
    }
    this.uniforms = new UniformGroup({
      uPixelSize: { value: this.state.size, type: "f32" },
      uSize: {
        value: new Point(window.innerWidth, window.innerHeight),
        type: "vec2<f32>",
      },
    });
  }

  shaderName(): string {
    return DotsShader.SHADER_NAME;
  }

  defaultState(): DotsShaderState {
    return {
      ...super.defaultState(),
      size: 15,
    };
  }

  bind(container: Container, layer?: ILayer): void {
    super.bind(container, layer);
    this.container = container;
    this.refreshSize();
  }

  resize() {
    this.refreshSize();
  }

  refreshSize() {
    if (this.container.width > 0) {
      this.uniforms.uniforms.uSize = new Point(
        this.container.width,
        this.container.height
      );
    }
  }
}
