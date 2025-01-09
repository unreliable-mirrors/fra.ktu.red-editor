import { Container, FederatedPointerEvent, Filter, Ticker } from "pixi.js";
import {
  EditorLayerSetting,
  EditorLayerState,
  IEditorLayer,
} from "./ieditor_layer";
import { getSecureIndex } from "../scenes/editor_scene";
import { ShaderLayer, ShaderState } from "../shaders/shader_layer";
import { BnwShaderLayer, BnwShaderLayerState } from "../shaders/bnw/bnw_shader";
import {
  VintageShader,
  VintageShaderState,
} from "../shaders/vintage/vintage_shader";
import {
  PixelateShader,
  PixelateShaderState,
} from "../shaders/pixelate/pixelate_shader";
import DataStore from "../ui/core/data_store";
import EventDispatcher from "../ui/core/event_dispatcher";

export type ContainerLayerState = EditorLayerState & {
  shaders: EditorLayerState[];
};

export abstract class ContainerLayer implements IEditorLayer {
  layerId: number;
  container: Container;
  abstract state: ContainerLayerState;
  abstract settings: EditorLayerSetting[];
  active: boolean;
  shaders: ShaderLayer[];

  public constructor() {
    this.container = new Container();
    this.layerId = getSecureIndex();
    this.active = false;
    this.shaders = [];
  }

  addShaderFromState(stateName: string, state?: ShaderState): void {
    //TODO: DEDUPLICATE THIS
    if (stateName === "bnw_shader") {
      this.addBnwShader(state as BnwShaderLayerState);
    } else if (stateName === "vintage_shader") {
      this.addVintageShader(state as VintageShaderState);
    } else if (stateName === "pixelate_shader") {
      this.addPixelateShader(state as PixelateShaderState);
    }
  }
  //TODO: DEDUPLICATE THIS
  addBnwShader(state?: BnwShaderLayerState) {
    const layer = new BnwShaderLayer(state);
    this.addShader(layer);
  }
  //TODO: DEDUPLICATE THIS
  addVintageShader(state?: VintageShaderState) {
    const layer = new VintageShader(state);
    this.addShader(layer);
  }
  //TODO: DEDUPLICATE THIS
  addPixelateShader(state?: PixelateShaderState) {
    const layer = new PixelateShader(state);
    this.addShader(layer);
  }
  //TODO: DEDUPLICATE THIS
  addShader(shader: ShaderLayer): void {
    this.shaders.push(shader);
    shader.bind(this.container);
    this.state.shaders.push(shader.state);

    let filters: Filter[] = [];
    if (this.container.filters) {
      if (this.container.filters instanceof Array) {
        filters = [...this.container.filters];
      } else {
        filters.push(this.container.filters);
      }
    }
    filters.push(shader.shader);
    this.container.filters = filters;
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "activateLayer",
      shader
    );
  }

  //@ts-ignore
  bind(container: Container): void {}

  unbind(): void {}

  //@ts-ignore
  tick(time: Ticker): void {}

  //@ts-ignore
  pointerDown(event: FederatedPointerEvent): void {}
  //@ts-ignore
  pointerUp(event: FederatedPointerEvent): void {}
  //@ts-ignore
  pointerMove(event: FederatedPointerEvent): void {}
}
