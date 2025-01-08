import { FederatedPointerEvent, Graphics, Ticker } from "pixi.js";
import DataStore from "../ui/core/data_store";
import EventDispatcher from "../ui/core/event_dispatcher";
import { ILayer } from "../../engine/ilayer";
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

export class EditorScene extends BaseScene {
  activeLayer?: IEditorLayer;
  layers: IEditorLayer[];

  public constructor() {
    super();
    this.layers = [];
    this.container.eventMode = "static";

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
      this.activeLayer?.pointerDown(event);
    });
    this.container.on("pointerup", (event: FederatedPointerEvent) => {
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
      "loadState",
      (payload: EditorLayerState[]) => {
        for (const state of payload) {
          if (state.name === "mono_pixel_draw_layer") {
            this.addMonoPixelDrawLayer(state as MonoPixelDrawLayerState);
          } else if (state.name === "background_layer") {
            this.addBackgroundLayer(state as BackgroundLayerState);
          }
        }
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "exportState",
      () => {
        const state = this.layers.map((e) => e.state);
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
      function (e) {
        e.preventDefault();
      },
      false
    );
  }

  activateLayer(layer: IEditorLayer) {
    if (this.activeLayer) this.activeLayer.active = false;
    this.activeLayer = layer;
    this.activeLayer.active = true;
    DataStore.getInstance().setStore("layers", this.layers);
  }

  addLayer(layer: ILayer): void {
    super.addLayer(layer);
    this.activateLayer(layer as IEditorLayer);
    DataStore.getInstance().setStore("layers", this.layers);
  }

  async addMonoPixelDrawLayer(state?: MonoPixelDrawLayerState) {
    const layer = new MonoPixelDrawLayer(state);
    this.addLayer(layer);
  }

  async addBackgroundLayer(state?: BackgroundLayerState) {
    const layer = new BackgroundLayer(state);
    this.addLayer(layer);
  }
}
