import { Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./vlines_shader.frag?raw";
import { ILayer } from "../../../engine/ilayer";

export type VLinesShaderState = ShaderState & {
  size: number;
};

export type VLinesShaderSetting = {
  field: "size";
  type: "integer";
  onchange: (value: string) => void;
};

export class VLinesShader extends ShaderLayer {
  static SHADER_NAME: string = "vlines_shader";
  declare state: VLinesShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: VLinesShaderSetting[] = [
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

  constructor(state?: VLinesShaderState) {
    super();
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        size: state.size,
        missProbability: state.missProbability,
        seed: state.seed,
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
    return VLinesShader.SHADER_NAME;
  }

  defaultState(): VLinesShaderState {
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
