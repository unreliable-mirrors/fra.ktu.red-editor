import {
  Application,
  Matrix,
  Point,
  Sprite,
  Texture,
  TextureMatrix,
  TextureSource,
  UniformData,
} from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./time_fade_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";
import DataStore from "../../ui/core/data_store";
import vertex from "./time_fade_shader.vert?raw";

export type TimeFadeShaderState = ShaderState & {
  strength: number;
  dynamicStrength: boolean;
};

export type TimeFadeShaderSetting = {
  field: ShaderSetting["field"] | "strength" | "dynamicStrength" | "refresh";
  type: ShaderSetting["type"] | "float" | "boolean" | "modulator_only";
  onchange: (value: string) => void;
};

export class TimeFadeShader extends ShaderLayer {
  static SHADER_NAME: string = "time_fade_shader";
  declare state: TimeFadeShaderState;
  fragment: string = fragment;

  timeTexture!: Texture;
  textureMatrix!: TextureMatrix;

  settings: TimeFadeShaderSetting[] = [
    {
      field: "strength",
      type: "float",
      onchange: (value) => {
        this.state.strength = parseFloat(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
      },
    },
    {
      field: "dynamicStrength",
      type: "boolean",
      onchange: (value) => {
        this.state.dynamicStrength = "true" === value || parseFloat(value) >= 1;
        this.uniforms.uniforms.uDynamicStrength = this.state.dynamicStrength
          ? 1
          : 0;
      },
    },
    {
      field: "refresh",
      type: "modulator_only",
      onchange: (value) => {
        if (parseFloat(value) >= 1) {
          const oldTexture = this.timeTexture;
          this.timeTexture = (
            DataStore.getInstance().getStore("app") as Application
          ).renderer.generateTexture(this.container!);

          this.textureMatrix.texture = this.timeTexture;

          (
            DataStore.getInstance().getStore("app") as Application
          ).renderer.filter
            .calculateSpriteMatrix(
              this.uniforms.uniforms.uFilterMatrix as Matrix,
              new Sprite(this.timeTexture)
            )
            .prepend(this.textureMatrix.mapCoord);

          this.shader.resources.uTimeTexture = this.timeTexture.source;
          this.uniforms.uniforms.uTime = Math.random() * 60;
          oldTexture.destroy(true);
        }
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: TimeFadeShaderState, includeModulators: boolean = false) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        strength: state.strength,
        dynamicStrength: state.dynamicStrength,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return TimeFadeShader.SHADER_NAME;
  }

  defaultState(): TimeFadeShaderState {
    return { ...super.defaultState(), strength: 0.1, dynamicStrength: false };
  }

  getExtraTextures(): { [key: string]: TextureSource } {
    return {
      uTimeTexture: this.timeTexture.source,
    };
  }

  getVertex(): string {
    return vertex;
  }

  setupUniformValues(): { [key: string]: UniformData } {
    console.log("bindedlayer", this.bindedLayer);
    this.timeTexture = (
      DataStore.getInstance().getStore("app") as Application
    ).renderer.generateTexture(this.container!);
    this.textureMatrix = new TextureMatrix(this.timeTexture);

    return {
      uStrength: { value: this.state.strength, type: "f32" },
      uDynamicStrength: {
        value: this.state.dynamicStrength ? 1 : 0,
        type: "i32",
      },
      uSize: {
        value: new Point(window.innerWidth, window.innerHeight),
        type: "vec2<f32>",
      },
      uTime: { value: Math.random(), type: "f32" },
      uFilterMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
      uTimeClamp: { value: this.textureMatrix.uClampFrame, type: "vec4<f32>" },
    };
  }
}
