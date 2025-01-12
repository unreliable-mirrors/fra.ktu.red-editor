import {
  AnaglyphShader,
  AnaglyphShaderState,
} from "../shaders/anaglyph/anaglyph_shader";
import { BnwShader, BnwShaderState } from "../shaders/bnw/bnw_shader";
import {
  MontecarloSampleShader,
  MontecarloSampleShaderState,
} from "../shaders/montecarlo_sample/montecarlo_sample";
import {
  PixelateShader,
  PixelateShaderState,
} from "../shaders/pixelate/pixelate_shader";
import { ShaderLayer, ShaderState } from "../shaders/shader_layer";
import {
  VintageShader,
  VintageShaderState,
} from "../shaders/vintage/vintage_shader";

export type ShaderClass = {
  SHADER_NAME: string;
};
export const AVAILABLE_SHADERS: ShaderClass[] = [
  BnwShader,
  VintageShader,
  PixelateShader,
  MontecarloSampleShader,
  AnaglyphShader,
];

export const AVAILABLE_SHADERS_MAP: Record<string, ShaderClass> =
  Object.fromEntries(
    AVAILABLE_SHADERS.map((cls: ShaderClass) => [cls.SHADER_NAME, cls])
  );

export const AVAILABLE_SHADERS_NAMES: string[] = AVAILABLE_SHADERS.map(
  (e) => e.SHADER_NAME
);

export const getShaderByName = (
  shaderName: string,
  state?: ShaderState
): ShaderLayer | null => {
  if (shaderName === BnwShader.SHADER_NAME) {
    return new BnwShader(state as BnwShaderState);
  } else if (shaderName === VintageShader.SHADER_NAME) {
    return new VintageShader(state as VintageShaderState);
  } else if (shaderName === PixelateShader.SHADER_NAME) {
    return new PixelateShader(state as PixelateShaderState);
  } else if (shaderName === MontecarloSampleShader.SHADER_NAME) {
    return new MontecarloSampleShader(state as MontecarloSampleShaderState);
  } else if (shaderName === AnaglyphShader.SHADER_NAME) {
    return new AnaglyphShader(state as AnaglyphShaderState);
  }
  return null;
};
