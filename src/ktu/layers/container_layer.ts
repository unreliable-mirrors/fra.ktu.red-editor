import { Container, FederatedPointerEvent, Filter, Ticker } from "pixi.js";
import {
  EditorLayerSetting,
  EditorLayerState,
  IEditorLayer,
} from "./ieditor_layer";

import { ShaderLayer, ShaderState } from "../shaders/shader_layer";
import { BnwShader, BnwShaderState } from "../shaders/bnw/bnw_shader";
import {
  VintageShader,
  VintageShaderState,
} from "../shaders/vintage/vintage_shader";
import {
  PixelateShader,
  PixelateShaderState,
} from "../shaders/pixelate/pixelate_shader";
import EventDispatcher from "../ui/core/event_dispatcher";
import { getSecureIndex } from "../../engine/helpers/secure_index_helper";
import DataStore from "../ui/core/data_store";

export type ContainerLayerState = EditorLayerState & {
  shaders: EditorLayerState[];
};

export abstract class ContainerLayer implements IEditorLayer {
  layerId: number;
  container: Container;
  state: ContainerLayerState;
  abstract settings: EditorLayerSetting[];
  active: boolean;
  shaders: ShaderLayer[];

  public constructor(state?: ContainerLayerState) {
    this.container = new Container();
    this.active = false;
    this.shaders = [];
    this.layerId = getSecureIndex();

    if (state) {
      this.state = {
        name: state.name,
        layerId: this.layerId,
        visible: state.visible,
        shaders: [],
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
      }
    } else {
      this.state = this.defaultState();
    }
  }

  abstract layerName(): string;

  defaultState(): ContainerLayerState {
    return {
      name: this.layerName(),
      layerId: this.layerId,
      visible: true,
      shaders: [],
    };
  }

  set visible(value: boolean) {
    this.container.visible = value;
    this.state.visible = value;
  }

  get visible(): boolean {
    return this.state.visible;
  }

  addShaderFromState(stateName: string, state?: ShaderState): void {
    //TODO: DEDUPLICATE THIS
    if (stateName === "bnw_shader") {
      this.addBnwShader(state as BnwShaderState);
    } else if (stateName === "vintage_shader") {
      this.addVintageShader(state as VintageShaderState);
    } else if (stateName === "pixelate_shader") {
      this.addPixelateShader(state as PixelateShaderState);
    }
  }
  //TODO: DEDUPLICATE THIS
  addBnwShader(state?: BnwShaderState) {
    const layer = new BnwShader(state);
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

  removeShader(shader: ShaderLayer) {
    const index = this.shaders.indexOf(shader);
    if (index > -1) {
      this.shaders.splice(index, 1);
      if (this.container.filters) {
        if (this.container.filters instanceof Array) {
          const filters = [...this.container.filters];
          filters.splice(index, 1);
          this.container.filters = filters;
        } else {
          this.container.filters = [];
        }
      }
      shader.unbind();
      DataStore.getInstance().touch("layers");
      if (shader.active && this.shaders.length > 0) {
        EventDispatcher.getInstance().dispatchEvent(
          "scene",
          "activateLayer",
          this.shaders[0]
        );
      }
    }
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
