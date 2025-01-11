import { Container, FederatedPointerEvent, Filter, Ticker } from "pixi.js";
import {
  EditorLayerSetting,
  EditorLayerState,
  IEditorLayer,
} from "./ieditor_layer";

import { ShaderLayer, ShaderState } from "../shaders/shader_layer";
import EventDispatcher from "../ui/core/event_dispatcher";
import { getSecureIndex } from "../../engine/helpers/secure_index_helper";
import DataStore from "../ui/core/data_store";
import { getShaderByName } from "../helpers/shaders";

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
      console.log("CONST STATE", this.state);
    }
  }

  abstract layerName(): string;

  defaultState(): ContainerLayerState {
    console.log("SUPER DEFAULT", {
      ...ContainerLayer.DEFAULT_STATE,
      name: this.layerName(),
      layerId: this.layerId,
    });
    return {
      ...ContainerLayer.DEFAULT_STATE,
      name: this.layerName(),
      layerId: this.layerId,
    };
  }

  static DEFAULT_STATE: ContainerLayerState = {
    name: "",
    layerId: 0,
    visible: true,
    shaders: [],
  };

  set visible(value: boolean) {
    this.container.visible = value;
    this.state.visible = value;
  }

  get visible(): boolean {
    return this.state.visible;
  }

  addShaderFromState(shaderName: string, state?: ShaderState): void {
    this.addGenericShader(shaderName, state);
  }
  addGenericShader(shaderName: string, state?: ShaderState) {
    const layer = getShaderByName(shaderName, state);
    this.addShader(layer!);
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

  moveUpShader(shader: ShaderLayer) {
    const index = this.shaders.indexOf(shader);
    if (index > -1) {
      const newIndex = index + 1;
      const otherShader = this.shaders[newIndex];
      this.shaders.splice(newIndex, 0, this.shaders.splice(index, 1)[0]);
      if (this.container.filters instanceof Array) {
        const filters: Filter[] = [];
        for (let i = 0; i < this.container.filters.length; i++) {
          if (i === index) {
            filters.push(otherShader.shader);
          } else if (i === newIndex) {
            filters.push(shader.shader);
          } else {
            filters.push(this.container.filters[i]);
          }
        }
        this.container.filters = filters;
      }
    }
    DataStore.getInstance().touch("layers");
    if (!shader.active) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "activateLayer",
        shader
      );
    }
  }
  moveDownShader(shader: ShaderLayer) {
    const index = this.shaders.indexOf(shader);
    if (index > 0) {
      const newIndex = index - 1;
      const otherShader = this.shaders[newIndex];
      this.shaders.splice(newIndex, 0, this.shaders.splice(index, 1)[0]);
      if (this.container.filters instanceof Array) {
        const filters: Filter[] = [];
        for (let i = 0; i < this.container.filters.length; i++) {
          if (i === index) {
            filters.push(otherShader.shader);
          } else if (i === newIndex) {
            filters.push(shader.shader);
          } else {
            filters.push(this.container.filters[i]);
          }
        }
        this.container.filters = filters;
      }
    }
    DataStore.getInstance().touch("layers");
    if (!shader.active) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "activateLayer",
        shader
      );
    }
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
      if (shader.active) {
        EventDispatcher.getInstance().dispatchEvent(
          "scene",
          "activateLayer",
          this
        );
      }
      DataStore.getInstance().touch("layers");
    }
  }

  //@ts-ignore
  bind(container: Container): void {}

  unbind(): void {}

  //@ts-ignore
  tick(time: Ticker): void {
    for (const shader of this.shaders) {
      shader.tick(time);
    }
  }

  //@ts-ignore
  pointerDown(event: FederatedPointerEvent): void {}
  //@ts-ignore
  pointerUp(event: FederatedPointerEvent): void {}
  //@ts-ignore
  pointerMove(event: FederatedPointerEvent): void {}
}
