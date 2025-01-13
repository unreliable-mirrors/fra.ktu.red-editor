import { Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./hines_shader.frag?raw";
import { ILayer } from "../../../engine/ilayer";

export type HLinesShaderState = ShaderState & {
  size: number;
};

export type HLinesShaderSetting = {
  field: "size";
  type: "integer";
  onchange: (value: string) => void;
};

export class HLinesShader extends ShaderLayer {
  static SHADER_NAME: string = "hlines_shader";
  declare state: HLinesShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: HLinesShaderSetting[] = [
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

  constructor(state?: HLinesShaderState) {
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
    return HLinesShader.SHADER_NAME;
  }

  defaultState(): HLinesShaderState {
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
