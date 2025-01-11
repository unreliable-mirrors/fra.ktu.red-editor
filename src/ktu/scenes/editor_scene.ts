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
import { ShaderLayer, ShaderState } from "../shaders/shader_layer";
import { ContainerLayer } from "../layers/container_layer";
import { TextLayer, TextLayerState } from "../layers/text_layer";
import { DrawLayer, DrawLayerState } from "../layers/draw_layer";
import { downloadContent } from "../helpers/file";
import { getStartingName } from "../helpers/sparkle";
import { getShaderByName } from "../helpers/shaders";
import { ASSETS_MAP, rebuildAssets } from "../helpers/assets";

export type EditorSceneState = {
  layers: EditorLayerState[];
  shaders: EditorLayerState[];
  metadata: EditorSceneMetadata;
  assets: Record<string, string>;
};

export type EditorSceneMetadata = { name: string; timestamp: number };
export type EditorSceneHistoryEntry = {
  timestamp: number;
  raw: string;
  image: HTMLImageElement;
};

export class EditorScene extends BaseScene {
  activeLayer?: IEditorLayer;
  layers: ContainerLayer[];
  shaders: ShaderLayer[];
  metadata: EditorSceneMetadata;
  history: EditorSceneHistoryEntry[];

  public constructor() {
    super();
    this.layers = [];
    this.shaders = [];
    this.container.eventMode = "static";
    this.setupContainer();

    this.metadata = { name: getStartingName(), timestamp: Date.now() };
    DataStore.getInstance().setStore("metadata", this.metadata);

    this.history = [];
    DataStore.getInstance().setStore("history", this.history);

    setInterval(async () => {
      let jsonState = JSON.stringify(this.getStateObject());
      console.log("PREHISTORY", this.metadata.timestamp, this.history);
      if (this.history.length === 0 || this.history[0].raw != jsonState) {
        this.metadata.timestamp = Date.now();
        jsonState = JSON.stringify(this.getStateObject());
        this.history.unshift({
          timestamp: this.metadata.timestamp,
          raw: jsonState,
          image: await DataStore.getInstance()
            .getStore("app")
            .renderer.extract.image({
              target: this.container,
              resolution: 0.1,
              antialias: true,
            }),
        });
        this.history = this.history.slice(0, 5);

        DataStore.getInstance().setStore("history", this.history);
        console.log("POSTHISTORY", this.metadata.timestamp, this.history);
      } else {
        console.log("NOTHING CHANGED");
      }
    }, 60000);

    Ticker.shared.add((time) => {
      for (const layer of this.layers) {
        layer.tick(time);
      }
      for (const shader of this.shaders) {
        shader.tick(time);
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
      "add_shader",
      (shaderName: string) => {
        this.addGenericShader(shaderName);
      }
    );
    EventDispatcher.getInstance().addEventListener("scene", "newState", () => {
      this.newState();
    });
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "openState",
      (payload: EditorSceneState) => {
        this.newState(payload.metadata.timestamp);
        this.importState(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "importState",
      (payload: EditorSceneState) => {
        this.importState(payload, true);
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
        const state = this.getStateObject();
        const jsonStr = JSON.stringify(state);
        const filename = this.metadata.name + ".red";

        const content =
          "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr);
        downloadContent(filename, content);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "exportCanvas",
      async () => {
        const filename = this.metadata.name + ".png";
        const content = await DataStore.getInstance()
          .getStore("app")
          .renderer.extract.base64(this.container);
        downloadContent(filename, content);
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
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "setName",
      (name: string) => {
        this.metadata.name = name;
        //DataStore.getInstance().touch("metadata");
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
    document.addEventListener("paste", async (e: ClipboardEvent) => {
      console.log("PASTE", e.clipboardData?.files);
      if (e.clipboardData) {
        for (const file of e.clipboardData.files) {
          console.log("FILE", file.type);
          if (
            file.type.indexOf("image/") === 0 ||
            file.type.indexOf("video/") === 0
          ) {
            console.log("IMAGE");
            const fr: FileReader = new FileReader();
            fr.onload = (e) => {
              const payload: string = e.target!.result as string;
              console.log("URL", payload);
              this.addImageLayer({
                ...ImageLayer.DEFAULT_STATE,
                imageUrl: payload,
              });
            };
            if (file.size < 104857600) {
              console.log("READ");
              fr.readAsDataURL(file);
            } else {
              //TODO: Implement an alert system for this
              console.log("ERROR - No files larger than 100mb");
            }
          }
        }
      }
    });
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

  getStateObject(): EditorSceneState {
    const state = {
      layers: this.layers.map((e) => e.state),
      shaders: this.shaders.map((e) => e.state),
      metadata: this.metadata,
      assets: ASSETS_MAP,
    };
    return state;
  }
  newState(timestamp?: number) {
    if (!timestamp) {
      timestamp = Date.now();
    }
    this.metadata = { name: getStartingName(), timestamp: timestamp };
    DataStore.getInstance().setStore("metadata", this.metadata);

    this.activeLayer = undefined;
    DataStore.getInstance().setStore("activeLayer", this.activeLayer);

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
  }

  importState(payload: EditorSceneState, importing: boolean = false) {
    rebuildAssets(payload.assets);

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
      this.addGenericShader(state.name, state);
    }

    if (!importing) {
      this.metadata = payload.metadata;
      DataStore.getInstance().setStore("metadata", this.metadata);
    }
  }

  activateLayer(layer: IEditorLayer) {
    if (this.activeLayer) this.activeLayer.active = false;
    this.activeLayer = layer;
    DataStore.getInstance().setStore("activeLayer", this.activeLayer);
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
    console.log("STATE", state);
    const layer = new ImageLayer(state);
    this.addLayer(layer);
  }
  addTextLayer(state?: TextLayerState) {
    const layer = new TextLayer(state);
    this.addLayer(layer);
  }
  addGenericShader(shaderName: string, state?: ShaderState) {
    const layer = getShaderByName(shaderName, state);
    this.addShader(layer!);
  }
}
