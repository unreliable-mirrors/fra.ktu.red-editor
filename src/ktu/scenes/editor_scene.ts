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
import { Modulator } from "../modulators/modulator";
import { IModulator, ModulatorState } from "../../engine/imodulator";
import { getModulatorByName } from "../helpers/modulators";
import { IModulable } from "../../engine/imodulable";
import { LayerSetting } from "../../engine/ilayer";

export type EditorSceneState = {
  layers: ContainerLayerState[];
  shaders: ShaderState[];
  modulators: ModulatorState[];
  metadata: EditorSceneMetadata;
  assets: Record<string, string>;
};

export type EditorSceneMetadata = {
  name: string;
  timestamp: number;
  length: number;
};
export type EditorSceneHistoryEntry = {
  timestamp: number;
  raw: string;
  image: HTMLImageElement;
};

export class EditorScene extends BaseScene {
  activeLayer?: IEditorLayer;
  activeModulator?: IModulator;
  layers: ContainerLayer[];
  shaders: ShaderLayer[];
  modulators: IModulator[];
  metadata: EditorSceneMetadata;
  history: EditorSceneHistoryEntry[];
  lastSize: Point;
  graphics: Graphics;
  camera: Camera;
  frameSize: Point;
  elapsedTime: number;

  public constructor() {
    super();
    this.layers = [];
    this.shaders = [];
    this.modulators = [];
    this.container.eventMode = "static";
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.camera = new Camera(this.container);
    this.elapsedTime = 0;
    DataStore.getInstance().setStore("playing", true);
    DataStore.getInstance().setStore("elapsedTime", this.elapsedTime);

    this.frameSize = new Point(window.innerWidth, window.innerHeight);

    this.setupContainer();

    KeyboardManager.listenKeyboardEvents();

    this.metadata = {
      name: getStartingName(),
      timestamp: Date.now(),
      length: -1,
    };
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
      DataStore.getInstance().setStore("modulatorsVisibility", true);
      DataStore.getInstance().setStore("filesVisibility", true);
    } else {
      DataStore.getInstance().setStore("layersVisibility", false);
      DataStore.getInstance().setStore("shadersVisibility", false);
      DataStore.getInstance().setStore("modulatorsVisibility", false);
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
      if (DataStore.getInstance().getStore("playing")) {
        this.elapsedTime += time.elapsedMS;
        let loop = false;
        if (this.metadata.length > 0) {
          const t = this.elapsedTime % (this.metadata.length * 1000);
          if (t < this.elapsedTime) {
            loop = true;
          }
          this.elapsedTime = t;
        }
        if (
          Math.floor(this.elapsedTime / 100) !=
          Math.floor(DataStore.getInstance().getStore("elapsedTime") / 100)
        ) {
          DataStore.getInstance().setStore(
            "elapsedTime",
            this.elapsedTime,
            false
          );
        } else {
          DataStore.getInstance().setStore(
            "elapsedTime",
            this.elapsedTime,
            true
          );
        }
        for (const layer of this.layers) {
          layer.tick(time, loop);
        }
        for (const shader of this.shaders) {
          shader.tick(time, loop);
        }
        for (const modulator of this.modulators) {
          modulator.tick(this.elapsedTime);
        }
      }
    });

    EventDispatcher.getInstance().addEventListener(
      "scene",
      "togglePlayback",
      () => {
        DataStore.getInstance().setStore(
          "playing",
          !DataStore.getInstance().getStore("playing")
        );
      }
    );

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
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "toggleModulators",
      () => {
        DataStore.getInstance().setStore(
          "modulatorsVisibility",
          !DataStore.getInstance().getStore("modulatorsVisibility")
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
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "add_modulator",
      (modulatorName: string) => {
        console.log("ADD MODULATOR", modulatorName);
        this.addModulator(getModulatorByName(modulatorName)!);
        console.log("MODULATORS", this.modulators);
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
          this.addGenericLayer(state.name, state, true);
        } else if (payload instanceof ShaderLayer) {
          if (payload.bindedLayer) {
            (payload.bindedLayer as ContainerLayer).addGenericShader(
              state.name,
              state,
              true
            );
          } else {
            this.addGenericShader(state.name, state, true);
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "duplicateModulator",
      (payload: IModulator) => {
        const state = JSON.parse(JSON.stringify(payload.state));
        this.addModulator(getModulatorByName(state.name, state, true)!);
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
      "activateModulator",
      (payload: IModulator) => {
        console.log("ACTIVATE MODULATOR", payload);
        this.activateModulator(payload);
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
      "removeModulator",
      (payload: Modulator) => {
        this.removeModulator(payload);
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "setName",
      (name: string) => {
        this.metadata.name = name;
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "setLength",
      (length: number) => {
        this.metadata.length = length;
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
      modulators: this.modulators.map((e) => e.state),
      metadata: this.metadata,
      assets: ASSETS_MAP,
    };
    return state;
  }
  newState(timestamp?: number) {
    if (!timestamp) {
      timestamp = Date.now();
    }
    this.metadata = {
      name: getStartingName(),
      timestamp: timestamp,
      length: -1,
    };
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

    for (const modulator of this.modulators) {
      modulator.unbindAll();
    }
    this.modulators = [];
    DataStore.getInstance().setStore("modulators", this.modulators);

    this.setupContainer();
    this.container.addChild(this.graphics);

    this.elapsedTime = 0;
  }

  importState(payload: EditorSceneState, importing: boolean = false) {
    rebuildAssets(payload.assets);

    const importedModulators: {
      [key: number]: { layer: IModulable; setting: LayerSetting }[];
    } = {};
    const importedLayers: { [key: number]: IEditorLayer } = {};
    const layerSettings: { setting: LayerSetting; id: number }[] = [];

    for (const state of payload.layers) {
      const layer = this.addGenericLayer(state.name, state);
      importedLayers[state.layerId] = layer;
      layer.settings.forEach((s) => {
        if (
          s.type === "layer" &&
          (layer.state as { [key: string]: any })[s.field] >= 0
        ) {
          layerSettings.push({
            setting: s,
            id: (layer.state as { [key: string]: any })[s.field],
          });
        }
        (layer as ContainerLayer).shaders.forEach((shader) => {
          shader.settings.forEach((s) => {
            if (
              s.type === "layer" &&
              (shader.state as { [key: string]: any })[s.field] >= 0
            ) {
              layerSettings.push({
                setting: s,
                id: (shader.state as { [key: string]: any })[s.field],
              });
            }
          });
        });
      });
      state.modulators?.forEach((m) => {
        if (!importedModulators[m.modulatorId]) {
          importedModulators[m.modulatorId] = [];
        }
        importedModulators[m.modulatorId].push({
          layer,
          setting: layer.settings.find((s) => s.field === m.field)!,
        });
      });
      for (let i = 0; i < state.shaders.length; i++) {
        const shaderState = state.shaders[i];
        shaderState.modulators?.forEach((m) => {
          if (!importedModulators[m.modulatorId]) {
            importedModulators[m.modulatorId] = [];
          }
          const containerLayer = layer as ContainerLayer;
          importedModulators[m.modulatorId].push({
            layer: containerLayer.shaders[i],
            setting: containerLayer.shaders[i].settings.find(
              (s) => s.field === m.field
            )!,
          });
        });
      }
    }

    for (const state of payload.shaders) {
      const layer = this.addGenericShader(state.name, state);
      state.modulators?.forEach((m) => {
        if (!importedModulators[m.modulatorId]) {
          importedModulators[m.modulatorId] = [];
        }
        importedModulators[m.modulatorId].push({
          layer,
          setting: layer.settings.find((s) => s.field === m.field)!,
        });
      });
      layer.settings.forEach((s) => {
        if (
          s.type === "layer" &&
          (layer.state as { [key: string]: any })[s.field] >= 0
        ) {
          layerSettings.push({
            setting: s,
            id: (layer.state as { [key: string]: any })[s.field],
          });
        }
      });
    }

    const oldModulatorIds: { [key: number]: IModulator } = {};
    for (const state of payload.modulators) {
      const modulator = getModulatorByName(state.name, state)!;
      this.addModulator(modulator);
      state.modulators?.forEach((m) => {
        if (!importedModulators[m.modulatorId]) {
          importedModulators[m.modulatorId] = [];
        }
        importedModulators[m.modulatorId].push({
          layer: modulator,
          setting: modulator.settings.find((s) => s.field === m.field)!,
        });
      });
      oldModulatorIds[state.modulatorId] = modulator;
    }

    console.log(oldModulatorIds);
    for (const state of payload.modulators) {
      const modulator = oldModulatorIds[state.modulatorId];
      importedModulators[state.modulatorId]?.forEach((s) => {
        console.log("BIND", modulator, s.layer, s.setting);
        modulator.bind(s.layer, s.setting);
      });
    }

    for (const setting of layerSettings) {
      setting.setting.onchange(importedLayers[setting.id].getUniqueId() + "");
    }

    if (!importing) {
      this.metadata = payload.metadata;
      DataStore.getInstance().setStore("metadata", this.metadata);
    }
    DataStore.getInstance().touch("layers");
  }
  activateModulator(modulator: IModulator) {
    this.deactivateLayer();
    if (this.activeModulator) this.activeModulator.active = false;
    this.activeModulator = modulator;
    this.activeModulator.active = true;
    DataStore.getInstance().setStore("activeModulator", this.activeModulator);
    DataStore.getInstance().setStore("modulators", this.modulators);
  }
  deactivateModulator() {
    console.log("DEACTIVATE");
    if (this.activeModulator) this.activeModulator.active = false;
    this.activeModulator = undefined;
    console.log("AM", this.activeModulator);
    DataStore.getInstance().setStore("activeModulator", this.activeModulator);
    DataStore.getInstance().setStore("modulators", this.modulators);
  }
  addModulator(modulator: IModulator) {
    super.addModulator(modulator);
    this.activateModulator(modulator);
    DataStore.getInstance().setStore("modulators", this.modulators);
  }
  removeModulator(modulator: IModulator) {
    super.removeModulator(modulator);
    DataStore.getInstance().setStore("modulators", this.modulators);
    if (modulator.active && this.modulators.length > 0) {
      this.activateModulator(this.modulators[0]);
    } else {
      this.deactivateModulator();
    }
  }
  activateLayer(layer: IEditorLayer) {
    this.deactivateModulator();
    if (this.activeLayer) this.activeLayer.active = false;
    this.activeLayer = layer;
    DataStore.getInstance().setStore("activeLayer", this.activeLayer);
    this.activeLayer.active = true;
    DataStore.getInstance().setStore("layers", this.layers);
    DataStore.getInstance().setStore("shaders", this.shaders);
  }
  deactivateLayer() {
    if (this.activeLayer) this.activeLayer.active = false;
    this.activeLayer = undefined;
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
    state?: ContainerLayerState,
    includeModulators: boolean = false
  ): IEditorLayer {
    const layer = getLayerByName(layerName, state, includeModulators);
    this.addLayer(layer!);
    return layer!;
  }
  addGenericShader(
    shaderName: string,
    state?: ShaderState,
    includeModulators: boolean = false
  ): ShaderLayer {
    const layer = getShaderByName(shaderName, state, includeModulators);
    this.addShader(layer!);
    return layer!;
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
