import { Assets, Sprite } from "pixi.js";
import DataStore from "../../ui/core/data_store";
import EventDispatcher from "../../ui/core/event_dispatcher";
import { ILayer } from "../ilayer";
import { ContainerLayer } from "../layers/container_layer";
import { BaseScene } from "./base_scene";
import { ShaderLayer } from "../layers/shader_layer";

export class EditorScene extends BaseScene {
  public constructor() {
    super();
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
