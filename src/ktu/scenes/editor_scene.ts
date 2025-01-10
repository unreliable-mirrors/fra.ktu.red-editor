import { FederatedPointerEvent, Graphics, Ticker } from "pixi.js";
import DataStore from "../ui/core/data_store";
import EventDispatcher from "../ui/core/event_dispatcher";
import { BaseScene } from "../../engine/scenes/base_scene";
import { EditorLayerState, IEditorLayer } from "../layers/ieditor_layer";

import {
  BackgroundLayer,
  BackgroundLayerState,
} from "../layers/background_layer";
import { ImageLayer, ImageLayerState } from "../layers/image_layer";
import { ShaderLayer } from "../shaders/shader_layer";
import { ContainerLayer } from "../layers/container_layer";
import { BnwShader, BnwShaderState } from "../shaders/bnw/bnw_shader";
import {
  VintageShader,
  VintageShaderState,
} from "../shaders/vintage/vintage_shader";
import {
  PixelateShader,
  PixelateShaderState,
} from "../shaders/pixelate/pixelate_shader";
import { TextLayer, TextLayerState } from "../layers/text_layer";
import { DrawLayer, DrawLayerState } from "../layers/draw_layer";

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
    this.setupContainer();

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
      "add_draw_layer",
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
      "add_text_layer",
      () => {
        this.addTextLayer();
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
    EventDispatcher.getInstance().addEventListener("scene", "newState", () => {
      this.activeLayer = undefined;

      for (const shader of this.shaders) {
        shader.unbind();
      }
      this.container.filters = [];
      this.shaders = [];
      DataStore.getInstance().setStore("shaders", this.shaders);

      for (const layer of this.layers) {
        layer.unbind();
      }
      this.container.removeChildren();
      this.layers = [];
      DataStore.getInstance().setStore("layers", this.layers);

      this.setupContainer();
    });
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "loadState",
      (payload: EditorSceneState) => {
        for (const state of payload.layers) {
          if (state.name === "draw_layer") {
            this.addMonoPixelDrawLayer(state as DrawLayerState);
          } else if (state.name === "background_layer") {
            this.addBackgroundLayer(state as BackgroundLayerState);
          } else if (state.name === "image_layer") {
            this.addImageLayer(state as ImageLayerState);
          } else if (state.name === "text_layer") {
            this.addTextLayer(state as TextLayerState);
          }
        }

        for (const state of payload.shaders) {
          if (state.name === "bnw_shader") {
            this.addBnwShader(state as BnwShaderState);
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
      "duplicateLayer",
      (payload: ContainerLayer) => {
        const state = JSON.parse(JSON.stringify(payload.state));
        if (state.name === "draw_layer") {
          this.addMonoPixelDrawLayer(state as DrawLayerState);
        } else if (state.name === "background_layer") {
          this.addBackgroundLayer(state as BackgroundLayerState);
        } else if (state.name === "image_layer") {
          this.addImageLayer(state as ImageLayerState);
        } else if (state.name === "text_layer") {
          this.addTextLayer(state as TextLayerState);
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
        const filename = "image.red";
        const jsonStr = JSON.stringify(state);

        let element = document.createElement("a");
        element.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr)
        );
        element.setAttribute("download", filename);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "activateLayer",
      (payload: IEditorLayer) => {
        this.activateLayer(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveUpLayer",
      (payload: ContainerLayer) => {
        this.moveUpLayer(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveDownLayer",
      (payload: ContainerLayer) => {
        this.moveDownLayer(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "removeLayer",
      (payload: ContainerLayer) => {
        this.removeLayer(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "removeShader",
      (payload: ShaderLayer) => {
        this.removeShader(payload);
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

  setupContainer() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const g = new Graphics().rect(0, 0, width, height).fill(0xff0000);
    g.alpha = 0;
    this.container.addChild(g);
  }
  set visible(value: boolean) {
    this.container.visible = value;
  }

  get visible(): boolean {
    return this.container.visible;
  }

  activateLayer(layer: IEditorLayer) {
    if (this.activeLayer) this.activeLayer.active = false;
    this.activeLayer = layer;
    this.activeLayer.active = true;
    DataStore.getInstance().setStore("layers", this.layers);
    DataStore.getInstance().setStore("shaders", this.shaders);
  }
  removeLayer(layer: ContainerLayer) {
    super.removeLayer(layer);
    DataStore.getInstance().setStore("layers", this.layers);
    if (layer.active && this.layers.length > 0) {
      this.activateLayer(this.layers[0]);
    }
  }
  moveUpLayer(layer: ContainerLayer) {
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      const newIndex = index + 1;
      const otherLayer = this.layers[newIndex];
      this.layers.splice(newIndex, 0, this.layers.splice(index, 1)[0]);
      this.container.swapChildren(layer.container, otherLayer.container);
    }
    DataStore.getInstance().setStore("layers", this.layers);
    if (!layer.active) {
      this.activateLayer(layer);
    }
  }
  moveDownLayer(layer: ContainerLayer) {
    const index = this.layers.indexOf(layer);
    if (index > 0) {
      const newIndex = index - 1;
      const otherLayer = this.layers[newIndex];
      this.layers.splice(newIndex, 0, this.layers.splice(index, 1)[0]);
      this.container.swapChildren(layer.container, otherLayer.container);
    }
    DataStore.getInstance().setStore("layers", this.layers);
    if (!layer.active) {
      this.activateLayer(layer);
    }
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
  removeShader(shader: ShaderLayer) {
    super.removeShader(shader);
    DataStore.getInstance().setStore("shaders", this.shaders);
    if (shader.active && this.shaders.length > 0) {
      this.activateLayer(this.shaders[0]);
    }
  }

  addMonoPixelDrawLayer(state?: DrawLayerState) {
    const layer = new DrawLayer(state);
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
  addTextLayer(state?: TextLayerState) {
    const layer = new TextLayer(state);
    this.addLayer(layer);
  }
  addBnwShader(state?: BnwShaderState) {
    const layer = new BnwShader(state);
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
