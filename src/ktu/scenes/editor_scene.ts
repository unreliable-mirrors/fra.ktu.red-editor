import { FederatedPointerEvent, Filter, Graphics, Ticker } from "pixi.js";
import DataStore from "../ui/core/data_store";
import EventDispatcher from "../ui/core/event_dispatcher";
import { BaseScene } from "../../engine/scenes/base_scene";
import { ImageLayer } from "../layers/image_layer";
import { ShaderLayer, ShaderState } from "../shaders/shader_layer";
import { ContainerLayer, ContainerLayerState } from "../layers/container_layer";
import { downloadContent } from "../helpers/file";
import { getStartingName } from "../helpers/sparkle";
import { getShaderByName } from "../helpers/shaders";
import { ASSETS_MAP, rebuildAssets } from "../helpers/assets";
import { getLayerByName } from "../helpers/layers";
import { IEditorLayer } from "../layers/ieditor_layer";
import { listenKeyboardEvents } from "../helpers/keyboard_manager";

export type EditorSceneState = {
  layers: ContainerLayerState[];
  shaders: ShaderState[];
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
  showGeneralTips: boolean;

  public constructor() {
    super();
    this.layers = [];
    this.shaders = [];
    this.container.eventMode = "static";
    this.setupContainer();
    this.showGeneralTips = false;

    listenKeyboardEvents();

    DataStore.getInstance().setStore("showGeneralTips", this.showGeneralTips);

    this.metadata = { name: getStartingName(), timestamp: Date.now() };
    DataStore.getInstance().setStore("metadata", this.metadata);

    this.history = [];
    DataStore.getInstance().setStore("history", this.history);

    DataStore.getInstance().setStore("uiVisibility", true);
    DataStore.getInstance().setStore("hintsVisibility", true);

    setTimeout(() => {
      this.newState();
    }, 500);

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
      "toggleHints",
      () => {
        DataStore.getInstance().setStore(
          "hintsVisibility",
          !DataStore.getInstance().getStore("hintsVisibility")
        );
      }
    );
    EventDispatcher.getInstance().addEventListener("scene", "toggleUI", () => {
      DataStore.getInstance().setStore(
        "uiVisibility",
        !DataStore.getInstance().getStore("uiVisibility")
      );
    });
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "add_layer",
      (layerName: string) => {
        this.addGenericLayer(layerName);
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
        this.addGenericLayer(state.name, state);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "duplicateShader",
      (payload: ShaderLayer) => {
        const state = JSON.parse(JSON.stringify(payload.state));
        this.addGenericShader(state.name, state);
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
      "moveToTopLayer",
      (payload: ContainerLayer) => {
        this.moveToTopLayer(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveToBottomLayer",
      (payload: ContainerLayer) => {
        this.moveToBottomLayer(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveUpShader",
      (payload: ShaderLayer) => {
        this.moveUpShader(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveDownShader",
      (payload: ShaderLayer) => {
        this.moveDownShader(payload);
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
        if (!e.ctrlKey || e.metaKey) {
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
              this.addGenericLayer(ImageLayer.LAYER_NAME, {
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
      this.addGenericLayer(state.name, state);
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
    this.showGeneralTips = false;
    DataStore.getInstance().setStore("showGeneralTips", this.showGeneralTips);
  }
  deactivateLayer() {
    console.log("DEACTIVATE");
    if (this.activeLayer) this.activeLayer.active = false;
    this.activeLayer = undefined;
    console.log("AL", this.activeLayer);
    DataStore.getInstance().setStore("activeLayer", this.activeLayer);
    DataStore.getInstance().setStore("layers", this.layers);
    DataStore.getInstance().setStore("shaders", this.shaders);
  }
  removeLayer(layer: ContainerLayer) {
    super.removeLayer(layer);
    DataStore.getInstance().setStore("layers", this.layers);
    if (layer.active && this.layers.length > 0) {
      this.activateLayer(this.layers[0]);
    } else {
      this.deactivateLayer();
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
    } else {
      this.deactivateLayer();
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
  moveToTopLayer(layer: ContainerLayer) {
    console.log("MTT");
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      console.log("MTT I");
      this.layers.splice(index, 1);
      this.layers.push(layer);
      this.container.removeChild(layer.container);
      this.container.addChild(layer.container);
    }
    DataStore.getInstance().setStore("layers", this.layers);
    if (!layer.active) {
      this.activateLayer(layer);
    }
  }
  moveToBottomLayer(layer: ContainerLayer) {
    const index = this.layers.indexOf(layer);
    if (index > 0) {
      this.layers.splice(index, 1);
      this.layers.unshift(layer);
      this.container.removeChild(layer.container);
      this.container.addChildAt(layer.container, 1);
    }
    DataStore.getInstance().setStore("layers", this.layers);
    if (!layer.active) {
      this.activateLayer(layer);
    }
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
    DataStore.getInstance().setStore("shaders", this.shaders);
    if (!shader.active) {
      this.activateLayer(shader);
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
    DataStore.getInstance().setStore("shaders", this.shaders);
    if (!shader.active) {
      this.activateLayer(shader);
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
  addGenericLayer(layerName: string, state?: ContainerLayerState) {
    const layer = getLayerByName(layerName, state);
    this.addLayer(layer!);
  }
  addGenericShader(shaderName: string, state?: ShaderState) {
    const layer = getShaderByName(shaderName, state);
    this.addShader(layer!);
  }
}
