import { Container, Filter, Ticker, UniformGroup } from "pixi.js";

import {
  EditorLayerSetting,
  EditorLayerState,
  IEditorLayer,
} from "../layers/ieditor_layer";
import { getSecureIndex } from "../../engine/helpers/secure_index_helper";

import vertex from "./defaultFilter.vert?raw";
import { ILayer } from "../../engine/ilayer";

export type ShaderState = EditorLayerState;

export abstract class ShaderLayer implements IEditorLayer {
  layerId: number;
  state!: ShaderState;
  abstract settings: EditorLayerSetting[];
  active: boolean;
  shader!: Filter;
  abstract fragment: string;
  abstract uniforms: UniformGroup;
  bindedLayer?: ILayer;
  absorbingLayer: boolean = false;

  public constructor(state?: ShaderState) {
    this.layerId = getSecureIndex();
    this.active = false;

    if (state) {
      this.state = {
        name: state.name,
        layerId: this.layerId,
        visible: state.visible,
      };
    } else {
      this.state = this.defaultState();
    }
  }

  abstract shaderName(): string;

  defaultState(): ShaderState {
    return {
      name: this.shaderName(),
      layerId: this.layerId,
      visible: true,
    };
  }

  buildShader() {
    const uniforms = this.uniforms;
    this.shader = Filter.from({
      gl: {
        vertex: vertex,
        fragment: this.fragment,
      },
      resources: { uniforms },
    });
  }

  //@ts-ignore
  set visible(value: boolean) {
    this.state.visible = value;
    this.shader.enabled = this.state.visible;
    console.log("ENABLED", this.shader.enabled);
  }
  get visible(): boolean {
    return this.state.visible;
  }

  //@ts-ignore
  bind(container: Container, layer?: ILayer): void {
    this.buildShader();
    this.bindedLayer = layer;
  }

  unbind(): void {
    //TODO: REMOVE PROPERLY
  }

  //@ts-ignore
  resize(container: Container): void {}

  //@ts-ignore
  tick(time: Ticker): void {}

  //@ts-ignore
  pointerDown(event: PointerEvent): void {}

  //@ts-ignore
  pointerUp(event: PointerEvent): void {}
  //@ts-ignore
  pointerMove(event: PointerEvent): void {}
}
