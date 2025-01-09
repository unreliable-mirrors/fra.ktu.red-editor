import { Container, Filter, UniformGroup } from "pixi.js";
import { ShaderLayer } from "../shader_layer";

import vertex from "../defaultFilter.vert?raw";
import fragment from "./vintage_shader.frag?raw";

export type VintageShaderState = {
  name: string;
  layerId: number;
  strength: number;
};

export type VintageShaderSetting = {
  field: "strength";
  type: "float";
  onchange: (value: string) => void;
};

export class VintageShader extends ShaderLayer {
  shader: Filter;
  state: VintageShaderState;
  settings: VintageShaderSetting[] = [
    {
      field: "strength",
      type: "float",
      onchange: (value) => {
        this.state.strength = parseFloat(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: VintageShaderState) {
    super();

    if (state) {
      this.state = {
        name: state.name,
        layerId: state.layerId,
        strength: state.strength,
      };
    } else {
      this.state = {
        name: "vintage_shader",
        layerId: this.layerId,
        strength: 1,
      };
    }
    this.uniforms = new UniformGroup({
      uStrength: { value: this.state.strength, type: "f32" },
    });

    this.shader = this.buildShader();
  }

  buildShader(): Filter {
    const uniforms = this.uniforms;
    return Filter.from({
      gl: {
        vertex: vertex,
        fragment: fragment,
      },
      resources: { uniforms },
    });
  }

  bind(container: Container): void {
    super.bind(container);
  }
}
