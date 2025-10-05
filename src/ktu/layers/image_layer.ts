import {
  Assets,
  Container,
  Point,
  Sprite,
  Texture,
  Ticker,
  VideoSource,
} from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import DataStore from "../ui/core/data_store";
import { cacheAsset, freeAsset, getAsset } from "../helpers/assets";
import { registerModulatorsFromState } from "../helpers/modulators";
import { GifSprite } from "pixi.js/gif";
import EventDispatcher from "../ui/core/event_dispatcher";

export type ImageLayerState = ContainerLayerState & {
  panX: number;
  panY: number;
  scale: number;
  vFlip: boolean;
  hFlip: boolean;
  imageHash: string;
};

export type ImageLayerSetting = {
  field: "imageSource" | "panX" | "panY" | "scale" | "vFlip" | "hFlip";
  type: "file" | "float" | "integer" | "boolean";
  onchange: (value: string) => void;
};

export class ImageLayer extends ContainerLayer {
  static LAYER_NAME: string = "image_layer";
  declare state: ImageLayerState;
  clicking: boolean = false;
  panning: boolean = false;
  panStart?: Point | null;
  clickStart?: Point | null;
  settings: ImageLayerSetting[] = [
    {
      field: "imageSource",
      type: "file",
      onchange: (value) => {
        this.loadImage(value);
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
      field: "vFlip",
      type: "boolean",
      onchange: (value) => {
        this.state.vFlip = "true" === value || parseFloat(value) >= 1;
        this.reposition();
      },
    },
    {
      field: "hFlip",
      type: "boolean",
      onchange: (value) => {
        this.state.hFlip = "true" === value || parseFloat(value) >= 1;
        this.reposition();
      },
    },
  ];

  constructor(state?: ImageLayerState, includeModulators: boolean = false) {
    super(state);
    console.log("LAYER_ID", this.layerId);
    this.mainSprite = new Sprite();
    this.container.addChild(this.mainSprite);
    console.log("STATE LAYER_ID", this.state.layerId);
    if (state) {
      this.state = {
        ...this.state,
        panX: state.panX,
        panY: state.panY,
        scale: state.scale,
        imageHash: state.imageHash,
        vFlip: state.vFlip,
        hFlip: state.hFlip,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader, includeModulators);
      }
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }

    EventDispatcher.getInstance().addEventListener(
      "playing",
      "update",
      (value: boolean) => {
        if (
          this.mainSprite.texture &&
          this.mainSprite.texture.source instanceof VideoSource
        ) {
          const resource = this.mainSprite.texture.source.resource;
          if (value) {
            resource.play();
          } else {
            resource.pause();
          }
        } else if (this.mainSprite instanceof GifSprite) {
          const gif = this.mainSprite as GifSprite;
          if (value) {
            gif.play();
          } else {
            gif.stop();
          }
        }
      }
    );
  }

  layerName(): string {
    return ImageLayer.LAYER_NAME;
  }

  defaultState(): ImageLayerState {
    return {
      ...ImageLayer.DEFAULT_STATE(),
      ...super.defaultState(),
      panX: 100,
      panY: 100,
    };
  }

  static DEFAULT_STATE = (): ImageLayerState => {
    return {
      ...ContainerLayer.DEFAULT_STATE(),
      name: ImageLayer.LAYER_NAME,
      panX: 0,
      panY: 0,
      scale: 100,
      imageHash: "",
      vFlip: false,
      hFlip: false,
    };
  };

  pointerDown(event: PointerEvent): void {
    this.clicking = true;
    this.panning = true;
    this.panStart = new Point(this.state.panX, this.state.panY);
    this.clickStart = this.container.toLocal<Point>({
      x: event.clientX,
      y: event.clientY,
    });
  }
  pointerUp(): void {
    this.clicking = false;
    this.panning = false;
    this.panStart = null;
  }
  pointerMove(event: PointerEvent): void {
    if (this.panning) {
      const localPoint: Point = this.container.toLocal({
        x: event.clientX,
        y: event.clientY,
      });
      this.state.panX = this.panStart!.x + (localPoint.x - this.clickStart!.x);
      this.state.panY = this.panStart!.y + (localPoint.y - this.clickStart!.y);
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

    this.mainSprite.destroy();
    if (this.state.imageHash) {
      freeAsset(this.state.imageHash, this.layerId);
    }
  }

  repaint() {
    this.container.removeChildren();
    this.mainSprite.destroy();
    if (this.state.imageHash) {
      VideoSource.defaultOptions = {
        ...VideoSource.defaultOptions,
        loop: true,
        autoPlay: DataStore.getInstance().getStore("playing") || false,
      };

      //GET THE CONTENT
      const content = getAsset(this.state.imageHash, this.layerId);
      if (
        content.startsWith("data:image/gif;") ||
        content.indexOf(".gif") >= 0
      ) {
        Assets.load(content).then((tex) => {
          this.mainSprite = new GifSprite({
            source: tex,
            animationSpeed: 1,
            loop: true,
            autoPlay: DataStore.getInstance().getStore("playing") || false,
            onFrameChange: (_currentFrame: number) => {
              EventDispatcher.getInstance().dispatchEvent(
                this.getUniqueId() + "",
                "change",
                { sprite: this.mainSprite }
              );
            },
          });
          this.container.addChild(this.mainSprite);
          this.reposition();
          DataStore.getInstance().touch("layers");
        });
      } else {
        const texturePromise = Assets.load<Texture>(content);
        texturePromise.then((resolvedTexture: Texture) => {
          this.mainSprite = Sprite.from(resolvedTexture);
          this.container.addChild(this.mainSprite);
          this.reposition();
          DataStore.getInstance().touch("layers");
        });
      }
    } else {
      this.mainSprite = new Sprite();
      this.container.addChild(this.mainSprite);
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
    this.mainSprite.scale = this.state.scale / 100;
    this.mainSprite.anchor.set(0.5, 0.5);
    this.mainSprite.x = this.state.panX + this.mainSprite.width / 2;
    this.mainSprite.y = this.state.panY + this.mainSprite.height / 2;
    this.mainSprite.scale.y = this.state.vFlip
      ? -this.mainSprite.scale.y
      : this.mainSprite.scale.y;
    this.mainSprite.scale.x = this.state.hFlip
      ? -this.mainSprite.scale.x
      : this.mainSprite.scale.x;
  }

  loadImage(value: string) {
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
  }

  tick(time: Ticker, loop: boolean): void {
    super.tick(time, loop);
    if (loop) {
      if (
        this.mainSprite.texture &&
        this.mainSprite.texture.source instanceof VideoSource
      ) {
        const resource = this.mainSprite.texture.source.resource;
        resource.currentTime =
          DataStore.getInstance().getStore("elapsedTime") / 1000;
      } else if (this.mainSprite instanceof GifSprite) {
        const gif = this.mainSprite as GifSprite;
        gif.currentFrame =
          Math.floor(
            (DataStore.getInstance().getStore("elapsedTime") / 1000) *
              GifSprite.defaultOptions.fps!
          ) % gif.totalFrames;
      }
    }
  }
}
