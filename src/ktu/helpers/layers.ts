import {
  BackgroundLayer,
  BackgroundLayerState,
} from "../layers/background_layer";
import { ContainerLayer, ContainerLayerState } from "../layers/container_layer";
import { DrawLayer, DrawLayerState } from "../layers/draw_layer";
import { ImageLayer, ImageLayerState } from "../layers/image_layer";
import { TextLayer, TextLayerState } from "../layers/text_layer";

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

export const getLayerByName = (
  layerName: string,
  state?: ContainerLayerState
): ContainerLayer | null => {
  if (layerName === BackgroundLayer.LAYER_NAME) {
    return new BackgroundLayer(state as BackgroundLayerState);
  } else if (layerName === DrawLayer.LAYER_NAME) {
    return new DrawLayer(state as DrawLayerState);
  } else if (layerName === ImageLayer.LAYER_NAME) {
    return new ImageLayer(state as ImageLayerState);
  } else if (layerName === TextLayer.LAYER_NAME) {
    return new TextLayer(state as TextLayerState);
  }
  return null;
};
