import { Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./anaglyph_shader.frag?raw";
import { ContainerLayer } from "../../layers/container_layer";
import { ILayer } from "../../../engine/ilayer";

export type AnaglyphShaderState = ShaderState & {
  strength: number;
};

export type AnaglyphShaderSetting = {
  field: "strength";
  type: "integer";
  onchange: (value: string) => void;
};

export class AnaglyphShader extends ShaderLayer {
  static SHADER_NAME: string = "anaglyph_shader";
  declare state: AnaglyphShaderState;
  fragment: string = fragment;

  settings: AnaglyphShaderSetting[] = [
    {
      field: "strength",
      type: "integer",
      onchange: (value) => {
        this.state.strength = parseInt(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: AnaglyphShaderState) {
    super();

    if (state) {
      this.state = {
        ...this.state,
        strength: state.strength,
      };
    }
    this.uniforms = new UniformGroup({
      uStrength: { value: this.state.strength, type: "f32" },
      uSize: {
        value: new Point(1, 1),
        type: "vec2<f32>",
      },
    });
  }

  bind(container: Container, layer?: ILayer) {
    super.bind(container, layer);
    this.uniforms.uniforms.uSize = new Point(container.width, container.height);
    console.log("UNIFORMS", this.uniforms.uniforms.uSize);
  }

  resize(container: Container) {
    this.uniforms.uniforms.uSize = new Point(container.width, container.height);
    console.log("UNIFORMS", this.uniforms.uniforms.uSize);
  }

  shaderName(): string {
    return AnaglyphShader.SHADER_NAME;
  }

  defaultState(): AnaglyphShaderState {
    return { ...super.defaultState(), strength: 1 };
  }
}
