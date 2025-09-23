import {
  AnaglyphShader,
  AnaglyphShaderState,
} from "../shaders/anaglyph/anaglyph_shader";
import { BnwShader, BnwShaderState } from "../shaders/bnw/bnw_shader";
import { HLinesShader, HLinesShaderState } from "../shaders/hines/hines_shader";
import {
  MontecarloSampleShader,
  MontecarloSampleShaderState,
} from "../shaders/montecarlo_sample/montecarlo_sample";
import {
  ChromaShader,
  ChromaShaderState,
} from "../shaders/chroma/chroma_shader";
import {
  PixelateShader,
  PixelateShaderState,
} from "../shaders/pixelate/pixelate_shader";
import {
  PosterizeShader,
  PosterizeShaderState,
} from "../shaders/posterize/posterize_shader";
import { ShaderLayer, ShaderState } from "../shaders/shader_layer";
import { VLinesShader, VLinesShaderState } from "../shaders/vines/vines_shader";
import {
  VintageShader,
  VintageShaderState,
} from "../shaders/vintage/vintage_shader";
import {
  ScrambleShader,
  ScrambleShaderState,
} from "../shaders/scramble/scramble_shader";
import {
  NegativeShader,
  NegativeShaderState,
} from "../shaders/negative/negative_shader";
import {
  CrossesShader,
  CrossesShaderState,
} from "../shaders/crosses/crosses_shader";
import {
  RecolourShader,
  RecolourShaderState,
} from "../shaders/recolour/recolour_shader";
import {
  HNoiseLinesShader,
  HNoiseLinesShaderState,
} from "../shaders/hnoise_lines/hnoise_lines_shader";
import {
  LightSplitShader,
  LightSplitShaderState,
} from "../shaders/light_split/light_split_shader";
import { AlphaShader, AlphaShaderState } from "../shaders/alpha/alpha_shader";
import {
  MultiPosterizeShader,
  MultiPosterizeShaderState,
} from "../shaders/multi_posterize/multi_posterize_shader";
import { BlurShader, BlurShaderState } from "../shaders/blur/blur_shader";
import {
  HsbBlurShader,
  HsbBlurShaderState,
} from "../shaders/hsb_blur/hsb_blur_shader";
import {
  HueOffsetShader,
  HueOffsetShaderState,
} from "../shaders/hue_offset/hue_offset_shader";
import {
  HuePosterizeShader,
  HuePosterizeShaderState,
} from "../shaders/hue_posterize/hue_posterize_shader";
import {
  PaletteRecolourShader,
  PaletteRecolourShaderState,
} from "../shaders/palette_recolour/palette_recolour_shader";

export type ShaderClass = {
  SHADER_NAME: string;
};
export const AVAILABLE_SHADERS: ShaderClass[] = [
  BnwShader,
  VintageShader,
  PixelateShader,
  MontecarloSampleShader,
  AnaglyphShader,
  PosterizeShader,
  VLinesShader,
  HLinesShader,
  ChromaShader,
  ScrambleShader,
  NegativeShader,
  CrossesShader,
  RecolourShader,
  HNoiseLinesShader,
  LightSplitShader,
  AlphaShader,
  MultiPosterizeShader,
  BlurShader,
  HsbBlurShader,
  HueOffsetShader,
  HuePosterizeShader,
  PaletteRecolourShader,
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
  state?: ShaderState,
  includeModulators: boolean = false
): ShaderLayer | null => {
  if (shaderName === BnwShader.SHADER_NAME) {
    return new BnwShader(state as BnwShaderState, includeModulators);
  } else if (shaderName === VintageShader.SHADER_NAME) {
    return new VintageShader(state as VintageShaderState, includeModulators);
  } else if (shaderName === PixelateShader.SHADER_NAME) {
    return new PixelateShader(state as PixelateShaderState, includeModulators);
  } else if (shaderName === MontecarloSampleShader.SHADER_NAME) {
    return new MontecarloSampleShader(
      state as MontecarloSampleShaderState,
      includeModulators
    );
  } else if (shaderName === AnaglyphShader.SHADER_NAME) {
    return new AnaglyphShader(state as AnaglyphShaderState, includeModulators);
  } else if (shaderName === PosterizeShader.SHADER_NAME) {
    return new PosterizeShader(
      state as PosterizeShaderState,
      includeModulators
    );
  } else if (shaderName === VLinesShader.SHADER_NAME) {
    return new VLinesShader(state as VLinesShaderState, includeModulators);
  } else if (shaderName === HLinesShader.SHADER_NAME) {
    return new HLinesShader(state as HLinesShaderState, includeModulators);
  } else if (shaderName === ChromaShader.SHADER_NAME) {
    return new ChromaShader(state as ChromaShaderState, includeModulators);
  } else if (shaderName === ScrambleShader.SHADER_NAME) {
    return new ScrambleShader(state as ScrambleShaderState, includeModulators);
  } else if (shaderName === NegativeShader.SHADER_NAME) {
    return new NegativeShader(state as NegativeShaderState, includeModulators);
  } else if (shaderName === CrossesShader.SHADER_NAME) {
    return new CrossesShader(state as CrossesShaderState, includeModulators);
  } else if (shaderName === RecolourShader.SHADER_NAME) {
    return new RecolourShader(state as RecolourShaderState, includeModulators);
  } else if (shaderName === HNoiseLinesShader.SHADER_NAME) {
    return new HNoiseLinesShader(
      state as HNoiseLinesShaderState,
      includeModulators
    );
  } else if (shaderName === LightSplitShader.SHADER_NAME) {
    return new LightSplitShader(
      state as LightSplitShaderState,
      includeModulators
    );
  } else if (shaderName === AlphaShader.SHADER_NAME) {
    return new AlphaShader(state as AlphaShaderState, includeModulators);
  } else if (shaderName === MultiPosterizeShader.SHADER_NAME) {
    return new MultiPosterizeShader(
      state as MultiPosterizeShaderState,
      includeModulators
    );
  } else if (shaderName === BlurShader.SHADER_NAME) {
    return new BlurShader(state as BlurShaderState, includeModulators);
  } else if (shaderName === HsbBlurShader.SHADER_NAME) {
    return new HsbBlurShader(state as HsbBlurShaderState, includeModulators);
  } else if (shaderName === HueOffsetShader.SHADER_NAME) {
    return new HueOffsetShader(
      state as HueOffsetShaderState,
      includeModulators
    );
  } else if (shaderName === HuePosterizeShader.SHADER_NAME) {
    return new HuePosterizeShader(
      state as HuePosterizeShaderState,
      includeModulators
    );
  } else if (shaderName === PaletteRecolourShader.SHADER_NAME) {
    return new PaletteRecolourShader(
      state as PaletteRecolourShaderState,
      includeModulators
    );
  }

  return null;
};
