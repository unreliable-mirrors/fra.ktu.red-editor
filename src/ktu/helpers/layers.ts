import {
  BackgroundLayer,
  BackgroundLayerState,
} from "../layers/background_layer";
import { ContainerLayer, ContainerLayerState } from "../layers/container_layer";
import { DrawLayer, DrawLayerState } from "../layers/draw_layer";
import { ImageLayer, ImageLayerState } from "../layers/image_layer";
import { ShapeLayer, ShapeLayerState } from "../layers/shape_layer";
import { TextLayer, TextLayerState } from "../layers/text_layer";

export type LayerClass = {
  LAYER_NAME: string;
};
export const AVAILABLE_LAYERS: LayerClass[] = [
  BackgroundLayer,
  DrawLayer,
  ImageLayer,
  TextLayer,
  ShapeLayer,
];
export const AVAILABLE_LAYER_NAMES: string[] = AVAILABLE_LAYERS.map(
  (e) => e.LAYER_NAME
);

export const getLayerByName = (
  layerName: string,
  state?: ContainerLayerState,
  includeModulators: boolean = false
): ContainerLayer | null => {
  if (layerName === BackgroundLayer.LAYER_NAME) {
    return new BackgroundLayer(
      state as BackgroundLayerState,
      includeModulators
    );
  } else if (layerName === DrawLayer.LAYER_NAME) {
    return new DrawLayer(state as DrawLayerState, includeModulators);
  } else if (layerName === ImageLayer.LAYER_NAME) {
    return new ImageLayer(state as ImageLayerState, includeModulators);
  } else if (layerName === TextLayer.LAYER_NAME) {
    return new TextLayer(state as TextLayerState, includeModulators);
  } else if (layerName === ShapeLayer.LAYER_NAME) {
    return new ShapeLayer(state as ShapeLayerState, includeModulators);
  }
  return null;
};
