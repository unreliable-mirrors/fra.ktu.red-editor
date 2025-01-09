import { BnwShader } from "../shaders/bnw/bnw_shader";
import { PixelateShader } from "../shaders/pixelate/pixelate_shader";
import { VintageShader } from "../shaders/vintage/vintage_shader";

export type ShaderClass = {
  SHADER_NAME: string;
};
export const AVAILABLE_SHADERS: ShaderClass[] = [
  BnwShader,
  VintageShader,
  PixelateShader,
];
export const AVAILABLE_SHADERS_NAMES: string[] = AVAILABLE_SHADERS.map(
  (e) => e.SHADER_NAME
);
