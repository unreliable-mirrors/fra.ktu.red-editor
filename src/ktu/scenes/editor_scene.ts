import { Filter, Graphics, Point, Rectangle, Ticker } from "pixi.js";
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
import { Camera } from "./camera";
import { KeyboardManager } from "../helpers/keyboard_manager";

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
  lastSize: Point;
  graphics: Graphics;
  camera: Camera;
  frameSize: Point;
  frameOverride: boolean = false;

  public constructor() {
    super();
    this.layers = [];
    this.shaders = [];
    this.container.eventMode = "static";
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.camera = new Camera(this.container);

    this.frameSize = new Point(window.innerWidth, window.innerHeight);

    this.setupContainer();

    KeyboardManager.listenKeyboardEvents();

    this.metadata = { name: getStartingName(), timestamp: Date.now() };
    DataStore.getInstance().setStore("metadata", this.metadata);

    this.history = [];
    DataStore.getInstance().setStore("history", this.history);

    this.lastSize = new Point(window.innerWidth, window.innerHeight);
    DataStore.getInstance().setStore("uiVisibility", true);
    DataStore.getInstance().setStore("hintsVisibility", true);
    console.log("INNERWIDTH", window.innerWidth);
    if (window.innerWidth > 1000) {
      DataStore.getInstance().setStore("layersVisibility", true);
      DataStore.getInstance().setStore("shadersVisibility", true);
      DataStore.getInstance().setStore("filesVisibility", true);
    } else {
      DataStore.getInstance().setStore("layersVisibility", false);
      DataStore.getInstance().setStore("shadersVisibility", false);
      DataStore.getInstance().setStore("filesVisibility", false);
    }

    setInterval(async () => {
      let jsonState = JSON.stringify(this.getStateObject());
      console.log("PREHISTORY", this.metadata.timestamp, this.history);
      if (this.history.length === 0 || this.history[0].raw != jsonState) {
        this.metadata.timestamp = Date.now();
        console.log("GAME STATE OBJECT", this.getStateObject());
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
      } else {
        console.log("NOTHING CHANGED");
      }
    }, 60000);

    Ticker.shared.add((time) => {
      if (
        this.lastSize.x != window.innerWidth ||
        this.lastSize.y != window.innerHeight
      ) {
        this.lastSize = new Point(window.innerWidth, window.innerHeight);
        this.setupContainer();
      }
      for (const layer of this.layers) {
        layer.tick(time);
      }
      for (const shader of this.shaders) {
        shader.tick(time);
      }
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
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "toggleFiles",
      () => {
        DataStore.getInstance().setStore(
          "filesVisibility",
          !DataStore.getInstance().getStore("filesVisibility")
        );
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "toggleLayers",
      () => {
        DataStore.getInstance().setStore(
          "layersVisibility",
          !DataStore.getInstance().getStore("layersVisibility")
        );
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "toggleShaders",
      () => {
        DataStore.getInstance().setStore(
          "shadersVisibility",
          !DataStore.getInstance().getStore("shadersVisibility")
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
      "duplicate",
      (payload: IEditorLayer) => {
        const state = JSON.parse(JSON.stringify(payload.state));
        if (payload instanceof ContainerLayer) {
          this.addGenericLayer(state.name, state);
        } else if (payload instanceof ShaderLayer) {
          if (payload.bindedLayer) {
            (payload.bindedLayer as ContainerLayer).addGenericShader(
              state.name,
              state
            );
          } else {
            this.addGenericShader(state.name, state);
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "exportState",
      () => {
        const state = this.getStateObject();
        console.log("EXPORT", state);
        const jsonStr = JSON.stringify(state);
        console.log("EXPORT", JSON.parse(jsonStr));
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
          .renderer.extract.base64({
            target: this.container,
            frame: new Rectangle(0, 0, window.innerWidth, innerHeight),
          });
        downloadContent(filename, content);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "exportViewport",
      async () => {
        const filename = this.metadata.name + ".png";
        console.log("CAMX", this.camera.offset);
        const content = await DataStore.getInstance()
          .getStore("app")
          .renderer.extract.base64({
            target: this.container,
            frame: new Rectangle(
              -this.camera.offset.x,
              -this.camera.offset.y,
              window.innerWidth,
              window.innerHeight
            ),
          });
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
      "clickLayer",
      (payload: { event: PointerEvent; layer: IEditorLayer }) => {
        if (!KeyboardManager.spacePressed) {
          if (this.activeLayer === payload.layer) {
            if (!this.activeLayer?.absorbingLayer) {
              this.activeLayer.pointerDown(payload.event);
            }
          } else if (
            !this.activeLayer?.absorbingLayer &&
            !payload.event.ctrlKey
          ) {
            if (!payload.layer.absorbingLayer || payload.event.ctrlKey) {
              this.activateLayer(payload.layer);
              if (!this.activeLayer?.absorbingLayer) {
                this.activeLayer?.pointerDown(payload.event);
              }
            }
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveUp",
      (layer: IEditorLayer) => {
        if (layer) {
          if (layer instanceof ContainerLayer) {
            this.moveUpLayer(layer);
          } else if (layer instanceof ShaderLayer && layer.bindedLayer) {
            (layer.bindedLayer as ContainerLayer).moveUpShader(layer);
          } else {
            this.moveUpShader(layer as ShaderLayer);
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveDown",
      (layer: IEditorLayer) => {
        console.log(
          "BEFORE FUNCTION",
          layer,
          layer instanceof ShaderLayer,
          (layer as ShaderLayer).bindedLayer
        );
        if (layer) {
          if (layer instanceof ContainerLayer) {
            this.moveDownLayer(layer);
          } else if (layer instanceof ShaderLayer && layer.bindedLayer) {
            (layer.bindedLayer as ContainerLayer).moveDownShader(layer);
          } else {
            this.moveDownShader(layer as ShaderLayer);
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveToTop",
      (layer: IEditorLayer) => {
        if (layer) {
          if (layer instanceof ContainerLayer) {
            this.moveToTopLayer(layer);
          } else if (layer instanceof ShaderLayer && layer.bindedLayer) {
            (layer.bindedLayer as ContainerLayer).moveToTopShader(layer);
          } else {
            this.moveToTopShader(layer as ShaderLayer);
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "moveToBottom",
      (layer: IEditorLayer) => {
        if (layer) {
          if (layer instanceof ContainerLayer) {
            this.moveToBottomLayer(layer);
          } else if (layer instanceof ShaderLayer && layer.bindedLayer) {
            (layer.bindedLayer as ContainerLayer).moveToBottomShader(layer);
          } else {
            this.moveToBottomShader(layer as ShaderLayer);
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "removeLayerShader",
      (payload: ContainerLayer | ShaderLayer) => {
        console.log("SHADELAYER", payload);
        if (payload instanceof ContainerLayer) {
          console.log("Container");
          this.removeLayer(payload);
        } else {
          if (payload.bindedLayer) {
            (payload.bindedLayer as ContainerLayer).removeShader(payload);
          } else {
            this.removeShader(payload);
          }
        }
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
      }
    );
    EventDispatcher.getInstance().addEventListener("scene", "resetZoom", () => {
      this.camera.reset();
    });
    EventDispatcher.getInstance().addEventListener("scene", "zoomIn", () => {
      this.camera.zoomIn();
    });
    EventDispatcher.getInstance().addEventListener("scene", "zoomOut", () => {
      this.camera.zoomOut();
    });
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
      if (e.clipboardData) {
        for (const file of e.clipboardData.files) {
          if (
            file.type.indexOf("image/") === 0 ||
            file.type.indexOf("video/") === 0
          ) {
            const fr: FileReader = new FileReader();
            fr.onload = (e) => {
              const payload: string = e.target!.result as string;
              const layer = this.addGenericLayer(ImageLayer.LAYER_NAME, {
                ...ImageLayer.DEFAULT_STATE(),
              }) as ImageLayer;
              layer.loadImage(payload);
            };
            if (file.size < 104857600) {
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
    this.graphics.clear();
    this.graphics.rect(0, 0, width, height).fill(0xff0000);
    this.graphics.alpha = 0;
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
    this.container.addChild(this.graphics);
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
    if (index > -1 && index < this.layers.length - 1) {
      const newIndex = index + 1;
      const otherLayer = this.layers[newIndex];
      this.layers.splice(newIndex, 0, this.layers.splice(index, 1)[0]);
      this.container.swapChildren(layer.container, otherLayer.container);
      DataStore.getInstance().setStore("layers", this.layers);
    }
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
      DataStore.getInstance().setStore("layers", this.layers);
    }
    if (!layer.active) {
      this.activateLayer(layer);
    }
  }
  moveToTopLayer(layer: ContainerLayer) {
    console.log("MTT");
    const index = this.layers.indexOf(layer);
    if (index > -1 && index < this.layers.length - 1) {
      console.log("MTT I");
      this.layers.splice(index, 1);
      this.layers.push(layer);
      this.container.removeChild(layer.container);
      this.container.addChild(layer.container);
      DataStore.getInstance().setStore("layers", this.layers);
    }
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
      DataStore.getInstance().setStore("layers", this.layers);
    }
    if (!layer.active) {
      this.activateLayer(layer);
    }
  }
  moveUpShader(shader: ShaderLayer) {
    const index = this.shaders.indexOf(shader);
    if (index > -1 && index < this.shaders.length - 1) {
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
      DataStore.getInstance().setStore("shaders", this.shaders);
    }
    if (!shader.active) {
      this.activateLayer(shader);
    }
  }
  moveDownShader(shader: ShaderLayer) {
    console.log("UNTIL HERE", shader);
    const index = this.shaders.indexOf(shader);
    if (index > 0) {
      console.log("UNTIL HERE 2", shader);
      const newIndex = index - 1;
      const otherShader = this.shaders[newIndex];
      this.shaders.splice(newIndex, 0, this.shaders.splice(index, 1)[0]);
      if (this.container.filters instanceof Array) {
        console.log("UNTIL HERE 3", shader);
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
      DataStore.getInstance().setStore("shaders", this.shaders);
    }
    if (!shader.active) {
      this.activateLayer(shader);
    }
  }
  moveToTopShader(shader: ShaderLayer) {
    const index = this.shaders.indexOf(shader);
    if (index > -1 && index < this.shaders.length - 1) {
      this.shaders.splice(index, 1);
      this.shaders.push(shader);
      if (this.container.filters instanceof Array) {
        const filters: Filter[] = [];
        for (let i = 0; i < this.container.filters.length; i++) {
          if (i !== index) {
            filters.push(this.container.filters[i]);
          }
        }
        filters.push(shader.shader);
        this.container.filters = filters;
      }
      DataStore.getInstance().setStore("shaders", this.shaders);
    }
    if (!shader.active) {
      this.activateLayer(shader);
    }
  }
  moveToBottomShader(shader: ShaderLayer) {
    const index = this.shaders.indexOf(shader);
    if (index > 0) {
      this.shaders.splice(index, 1);
      this.shaders.unshift(shader);
      if (this.container.filters instanceof Array) {
        const filters: Filter[] = [];
        for (let i = 0; i < this.container.filters.length; i++) {
          if (i !== index) {
            filters.push(this.container.filters[i]);
          }
        }
        filters.unshift(shader.shader);
        this.container.filters = filters;
      }
      DataStore.getInstance().setStore("shaders", this.shaders);
    }
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
    } else if (shader.bindedLayer) {
      this.activateLayer(shader.bindedLayer as IEditorLayer);
    } else {
      this.deactivateLayer();
    }
  }
  addGenericLayer(
    layerName: string,
    state?: ContainerLayerState
  ): IEditorLayer {
    const layer = getLayerByName(layerName, state);
    this.addLayer(layer!);
    return layer!;
  }
  addGenericShader(shaderName: string, state?: ShaderState) {
    const layer = getShaderByName(shaderName, state);
    this.addShader(layer!);
  }

  pointerDown(event: PointerEvent) {
    if (this.activeLayer?.absorbingLayer && !KeyboardManager.spacePressed) {
      this.activeLayer?.pointerDown(event);
    }
    this.camera.pointerDown(event);
  }

  pointerUp(event: PointerEvent) {
    if (!KeyboardManager.spacePressed) {
      this.activeLayer?.pointerUp(event);
    }
    this.camera.pointerUp();
  }

  pointerMove(event: PointerEvent) {
    if (!KeyboardManager.spacePressed) {
      this.activeLayer?.pointerMove(event);
    }
    this.camera.pointerMove(event);
  }

  scroll(event: WheelEvent) {
    this.camera.scroll(event);
  }
}
