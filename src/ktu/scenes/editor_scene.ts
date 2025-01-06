import {
  Assets,
  FederatedPointerEvent,
  Graphics,
  Sprite,
  Ticker,
} from "pixi.js";
import DataStore from "../ui/core/data_store";
import EventDispatcher from "../ui/core/event_dispatcher";
import { ILayer } from "../../engine/ilayer";
import { ContainerLayer } from "../layers/container_layer";
import { BaseScene } from "../../engine/scenes/base_scene";
import { ShaderLayer } from "../layers/shader_layer";
import { IEditorLayer } from "../layers/ieditor_layer";

export class EditorScene extends BaseScene {
  activeLayer?: IEditorLayer;
  public constructor() {
    super();
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
      console.log("CLICK");
      this.activeLayer?.pointerDown(event);
    });

    EventDispatcher.getInstance().addEventListener(
      "scene",
      "addSpriteLayer",
      () => {
        this.addSpriteLayer();
      }
    );
    EventDispatcher.getInstance().addEventListener(
      "scene",
      "addShaderLayer",
      () => {
        this.addShaderLayer();
      }
    );
  }

  addLayer(layer: ILayer): void {
    super.addLayer(layer);
    this.activeLayer = layer as IEditorLayer;
    DataStore.getInstance().setStore("layers", this.layers);
  }

  async addSpriteLayer() {
    console.log("ADD SPRITE LAYER");
    const layer = new ContainerLayer();
    //
    const texture = await Assets.load("/day1_1.png");
    const sprite = new Sprite(texture);
    sprite.x = Math.random() * 1000;
    layer.container.addChild(sprite);
    this.addLayer(layer);
  }

  addShaderLayer() {
    console.log("ADD SHADER LAYER");
    const layer = new ShaderLayer();
    this.addLayer(layer);
  }
}
