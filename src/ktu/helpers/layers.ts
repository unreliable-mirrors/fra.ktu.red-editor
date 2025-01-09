import { BackgroundLayer } from "../layers/background_layer";
import { DrawLayer } from "../layers/draw_layer";
import { ImageLayer } from "../layers/image_layer";
import { TextLayer } from "../layers/text_layer";

export type LayerClass = {
  LAYER_NAME: string;
};
export const AVAILABLE_LAYERS: LayerClass[] = [
  BackgroundLayer,
  DrawLayer,
  ImageLayer,
  TextLayer,
];
export const AVAILABLE_LAYER_NAMES: string[] = AVAILABLE_LAYERS.map(
  (e) => e.LAYER_NAME
);
