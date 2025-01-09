import { FederatedPointerEvent, Graphics, Ticker } from "pixi.js";
import DataStore from "../ui/core/data_store";
import EventDispatcher from "../ui/core/event_dispatcher";
import { BaseScene } from "../../engine/scenes/base_scene";
import { EditorLayerState, IEditorLayer } from "../layers/ieditor_layer";
import {
  MonoPixelDrawLayer,
  MonoPixelDrawLayerState,
} from "../layers/mono_pixel_draw_layer";
import {
  BackgroundLayer,
  BackgroundLayerState,
} from "../layers/background_layer";
import { ImageLayer, ImageLayerState } from "../layers/image_layer";
import { ShaderLayer } from "../shaders/shader_layer";
import { ContainerLayer } from "../layers/container_layer";
import { BnwShaderLayer, BnwShaderLayerState } from "../shaders/bnw/bnw_shader";
import {
  VintageShader,
  VintageShaderState,
} from "../shaders/vintage/vintage_shader";
import {
  PixelateShader,
  PixelateShaderState,
} from "../shaders/pixelate/pixelate_shader";

let index = 0;
export const getSecureIndex = (): number => {
  index++;
  return index;
};

export type EditorSceneState = {
  layers: EditorLayerState[];
  shaders: EditorLayerState[];
};

export class EditorScene extends BaseScene {
  activeLayer?: IEditorLayer;
  layers: ContainerLayer[];
  shaders: ShaderLayer[];

  public constructor() {
    super();
    this.layers = [];
    this.shaders = [];
    this.container.eventMode = "static";
    console.log("SCENE HEIGHT", window.innerHeight);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.container.addChild(
      new Graphics().rect(0, 0, width, height).fill(0x000000)
    );
    Ticker.shared.add((time) => {
      for (var layer of this.layers) {
        layer.tick(time);
      }
    });

    this.container.on("pointerdown", (event: FederatedPointerEvent) => {
      console.log("CLICK HEIGHT", window.innerHeight);
      this.activeLayer?.pointerDown(event);
    });
    this.container.on("pointerup", (event: FederatedPointerEvent) => {
      this.activeLayer?.pointerUp(event);
    });
    this.container.on("pointerupoutside", (event: FederatedPointerEvent) => {
      this.activeLayer?.pointerUp(event);
    });
    this.container.on("pointermove", (event: FederatedPointerEvent) => {
      this.activeLayer?.pointerMove(event);
    });

    EventDispatcher.getInstance().addEventListener(
      "scene",
      "add_mono_pixel_draw_layer",
      () => {
        this.addMonoPixelDrawLayer();
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "add_background_layer",
      () => {
        this.addBackgroundLayer();
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "add_image_layer",
      () => {
        this.addImageLayer();
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "add_bnw_shader",
      () => {
        this.addBnwShader();
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "add_vintage_shader",
      () => {
        this.addVintageShader();
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "add_pixelate_shader",
      () => {
        this.addPixelateShader();
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "loadState",
      (payload: EditorSceneState) => {
        for (const state of payload.layers) {
          if (state.name === "mono_pixel_draw_layer") {
            this.addMonoPixelDrawLayer(state as MonoPixelDrawLayerState);
          } else if (state.name === "background_layer") {
            this.addBackgroundLayer(state as BackgroundLayerState);
          } else if (state.name === "image_layer") {
            this.addImageLayer(state as ImageLayerState);
          }
        }

        for (const state of payload.shaders) {
          if (state.name === "bnw_shader") {
            this.addBnwShader(state as BnwShaderLayerState);
          } else if (state.name === "vintage_shader") {
            this.addVintageShader(state as VintageShaderState);
          } else if (state.name === "pixelate_shader") {
            this.addPixelateShader(state as PixelateShaderState);
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "exportState",
      () => {
        const state = {
          layers: this.layers.map((e) => e.state),
          shaders: this.shaders.map((e) => e.state),
        };
        console.log(JSON.stringify(state));
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "activateLayer",
      (payload: IEditorLayer) => {
        this.activateLayer(payload);
      }
    );
    document.addEventListener(
      "contextmenu",
      (e) => {
        if (!e.ctrlKey) {
          e.preventDefault();
        }
      },
      false
    );
  }

  activateLayer(layer: IEditorLayer) {
    if (this.activeLayer) this.activeLayer.active = false;
    this.activeLayer = layer;
    this.activeLayer.active = true;
    DataStore.getInstance().setStore("layers", this.layers);
    DataStore.getInstance().setStore("shaders", this.shaders);
  }

  addLayer(layer: ContainerLayer): void {
    super.addLayer(layer);
    this.activateLayer(layer);
    DataStore.getInstance().setStore("layers", this.layers);
  }

  addShader(layer: ShaderLayer): void {
    super.addShader(layer);
    this.activateLayer(layer);
    DataStore.getInstance().setStore("shaders", this.shaders);
  }

  addMonoPixelDrawLayer(state?: MonoPixelDrawLayerState) {
    const layer = new MonoPixelDrawLayer(state);
    this.addLayer(layer);
  }

  addBackgroundLayer(state?: BackgroundLayerState) {
    const layer = new BackgroundLayer(state);
    this.addLayer(layer);
  }
  addImageLayer(state?: ImageLayerState) {
    const layer = new ImageLayer(state);
    this.addLayer(layer);
  }
  addBnwShader(state?: BnwShaderLayerState) {
    const layer = new BnwShaderLayer(state);
    this.addShader(layer);
  }
  addVintageShader(state?: VintageShaderState) {
    const layer = new VintageShader(state);
    this.addShader(layer);
  }
  addPixelateShader(state?: PixelateShaderState) {
    const layer = new PixelateShader(state);
    this.addShader(layer);
  }
}
