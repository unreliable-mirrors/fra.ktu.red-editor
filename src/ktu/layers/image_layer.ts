import "@pixi/gif";
import {
  Assets,
  Container,
  FederatedPointerEvent,
  Point,
  Sprite,
  Texture,
  VideoSource,
} from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import DataStore from "../ui/core/data_store";
import { AnimatedGIF } from "@pixi/gif";
import { cacheAsset, freeAsset, getAsset } from "../helpers/assets";

export type ImageLayerState = ContainerLayerState & {
  alpha: number;
  panX: number;
  panY: number;
  scale: number;
  imageHash: string;
};

export type ImageLayerSetting = {
  field: "imageSource" | "alpha" | "panX" | "panY" | "scale";
  type: "file" | "float" | "integer";
  onchange: (value: string) => void;
};

export class ImageLayer extends ContainerLayer {
  static LAYER_NAME: string = "image_layer";
  declare state: ImageLayerState;
  sprite: Sprite;
  clicking: boolean = false;
  panning: boolean = false;
  panStart?: Point | null;
  clickStart?: Point | null;
  settings: ImageLayerSetting[] = [
    {
      field: "imageSource",
      type: "file",
      onchange: (value) => {
        if (value.startsWith("data:")) {
          console.log("STARTS WITH DATA");
          const hash = cacheAsset(value);
          this.state.imageHash = hash;
          this.repaint();
        } else {
          this.urlContentToDataUri(value).then((url: string) => {
            const hash = cacheAsset(url);
            this.state.imageHash = hash;
            this.repaint();
          });
        }
      },
    },
    {
      field: "scale",
      type: "integer",
      onchange: (value) => {
        this.state.scale = parseInt(value);
        this.reposition();
      },
    },
    {
      field: "panX",
      type: "integer",
      onchange: (value) => {
        this.state.panX = parseInt(value);
        this.reposition();
      },
    },
    {
      field: "panY",
      type: "integer",
      onchange: (value) => {
        this.state.panY = parseInt(value);
        this.reposition();
      },
    },
    {
      field: "alpha",
      type: "float",
      onchange: (value) => {
        this.state.alpha = parseFloat(value);
        this.reposition();
      },
    },
  ];

  constructor(state?: ImageLayerState) {
    super();
    console.log("LAYER_ID", this.layerId);
    this.sprite = new Sprite();
    this.container.addChild(this.sprite);
    console.log("STATE LAYER_ID", this.state.layerId);
    if (state) {
      this.state = {
        ...this.state,
        alpha: state.alpha,
        panX: state.panX,
        panY: state.panY,
        scale: state.scale,
        imageHash: state.imageHash,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
      }
    }
    console.log("STATE LAYER_ID", this.state.layerId);
  }

  layerName(): string {
    return ImageLayer.LAYER_NAME;
  }

  defaultState(): ImageLayerState {
    return {
      ...ImageLayer.DEFAULT_STATE(),
      ...super.defaultState(),
      panX: Math.floor(Math.random() * 0.7 * window.innerWidth),
      panY: Math.floor(Math.random() * 0.7 * window.innerHeight),
    };
  }

  static DEFAULT_STATE = (): ImageLayerState => {
    return {
      ...ContainerLayer.DEFAULT_STATE(),
      name: ImageLayer.LAYER_NAME,
      alpha: 1,
      panX: 0,
      panY: 0,
      scale: 100,
      imageHash: "",
    };
  };

  pointerDown(event: FederatedPointerEvent): void {
    this.clicking = true;
    if (event.ctrlKey || event.metaKey) {
      this.panning = true;
      this.panStart = new Point(this.state.panX, this.state.panY);
      this.clickStart = new Point(event.globalX, event.globalY);
    }
  }
  pointerUp(): void {
    this.clicking = false;
    this.panning = false;
    this.panStart = null;
  }
  pointerMove(event: FederatedPointerEvent): void {
    if (this.panning) {
      this.state.panX = this.panStart!.x + (event.globalX - this.clickStart!.x);
      this.state.panY = this.panStart!.y + (event.globalY - this.clickStart!.y);
      this.reposition();
      DataStore.getInstance().touch("layers");
    }
  }

  bind(container: Container): void {
    super.bind(container);
    this.repaint();
  }

  unbind(): void {
    super.unbind();

    this.sprite.destroy();
    if (this.state.imageHash) {
      freeAsset(this.state.imageHash, this.layerId);
    }
  }

  repaint() {
    this.container.removeChildren();
    this.sprite.destroy();
    if (this.state.imageHash) {
      VideoSource.defaultOptions = {
        ...VideoSource.defaultOptions,
        loop: true,
      };

      //GET THE CONTENT
      const content = getAsset(this.state.imageHash, this.layerId);
      console.log("REPAINT", this.state.imageHash, content);
      if (
        content.startsWith("data:image/gif;") ||
        content.indexOf(".gif") >= 0
      ) {
        fetch(content)
          .then((res) => res.arrayBuffer())
          .then(AnimatedGIF.fromBuffer)
          .then((image) => {
            this.sprite = image;
            this.container.addChild(image);
            this.reposition();
            DataStore.getInstance().touch("layers");
          });
      } else {
        const texturePromise = Assets.load<Texture>(content);
        texturePromise.then((resolvedTexture: Texture) => {
          this.sprite = Sprite.from(resolvedTexture);
          this.container.addChild(this.sprite);
          this.reposition();
          DataStore.getInstance().touch("layers");
        });
      }
    } else {
      this.sprite = new Sprite();
      this.container.addChild(this.sprite);
    }
  }

  urlContentToDataUri(url: string): Promise<string> {
    return fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((callback) => {
            let reader = new FileReader();
            reader.onload = function () {
              console.log("ONLOAD", this.result);
              callback(this.result as string);
            };
            reader.readAsDataURL(blob);
          })
      );
  }

  reposition() {
    this.sprite.scale = this.state.scale / 100;
    this.sprite.x = this.state.panX;
    this.sprite.y = this.state.panY;
    this.sprite.alpha = this.state.alpha;
  }
}
