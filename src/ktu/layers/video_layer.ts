import { Ticker, VideoSource } from "pixi.js";
import { ContainerLayer } from "./container_layer";
import { ImageLayer, ImageLayerSetting, ImageLayerState } from "./image_layer";
import DataStore from "../ui/core/data_store";
import { GifSprite } from "pixi.js/gif";
import { registerModulatorsFromState } from "../helpers/modulators";

export type VideoLayerState = ImageLayerState & {
  timeFrom: number;
  timeLength: number;
  speed: number;
};

export type VideoLayerSetting = ImageLayerSetting & {
  field: ImageLayerSetting["field"] | "timeFrom" | "timeLength" | "speed";
  type: ImageLayerSetting["type"] | "bigfloat";
};

export class VideoLayer extends ImageLayer {
  static LAYER_NAME: string = "video_layer";
  declare state: VideoLayerState;

  settings: VideoLayerSetting[] = [
    ...this.defaultSettings(),
    {
      field: "timeFrom",
      type: "bigfloat",
      onchange: (value) => {
        this.state.timeFrom = parseFloat(value);
      },
    },
    {
      field: "timeLength",
      type: "bigfloat",
      onchange: (value) => {
        this.state.timeLength = parseFloat(value);
      },
    },
    {
      field: "speed",
      type: "bigfloat",
      onchange: (value) => {
        if (!isNaN(parseFloat(value)) && parseFloat(value) > 0.0625) {
          this.state.speed = parseFloat(value);
          if (
            this.mainSprite.texture &&
            this.mainSprite.texture.source instanceof VideoSource
          ) {
            const resource = this.mainSprite.texture.source.resource;
            resource.playbackRate = this.state.speed;
          } else if (this.mainSprite instanceof GifSprite) {
            {
              const gif = this.mainSprite as GifSprite;
              gif.animationSpeed = this.state.speed;
            }
          }
        }
      },
    },
  ];

  constructor(state?: VideoLayerState, includeModulators: boolean = false) {
    super(state, false, false);
    if (state) {
      this.state = {
        ...this.state,
        timeFrom: state.timeFrom,
        timeLength: state.timeLength,
        speed: state.speed,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader, includeModulators);
      }

      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  layerName(): string {
    return VideoLayer.LAYER_NAME;
  }
  defaultState(): ImageLayerState {
    return {
      ...VideoLayer.DEFAULT_STATE(),
      ...super.defaultState(),
    };
  }

  static DEFAULT_STATE = (): VideoLayerState => {
    return {
      ...ContainerLayer.DEFAULT_STATE(),
      ...ImageLayer.DEFAULT_STATE(),
      timeFrom: 0,
      timeLength: -1,
      speed: 1,
    };
  };

  overtime(): boolean {
    let currentTime = 0;
    let duration = 0;
    if (
      this.mainSprite.texture &&
      this.mainSprite.texture.source instanceof VideoSource
    ) {
      const resource = this.mainSprite.texture.source.resource;
      currentTime = resource.currentTime;
      duration = resource.duration;
    } else if (this.mainSprite instanceof GifSprite) {
      const gif = this.mainSprite as GifSprite;
      currentTime = gif.currentFrame / GifSprite.defaultOptions.fps!;
      duration = gif.duration / 1000;
    } else {
      return false;
    }
    if (currentTime < this.state.timeFrom && duration > this.state.timeFrom)
      return true;
    if (this.state.timeLength > 0) {
      return currentTime > this.state.timeLength + this.state.timeFrom;
    }
    return false;
  }

  tick(time: Ticker, loop: boolean): void {
    super.tick(time, loop);
    if (this.overtime()) {
      this.correctTime();
    }
  }

  correctTime(): void {
    console.log("CORRECT TIME");
    let timeLength = this.state.timeLength;
    if (timeLength <= 0.1 || isNaN(timeLength)) {
      timeLength = 9999999;
    }
    const currentTime =
      (((DataStore.getInstance().getStore("elapsedTime") / 1000) *
        this.state.speed) %
        timeLength) +
      this.state.timeFrom;
    if (
      this.mainSprite.texture &&
      this.mainSprite.texture.source instanceof VideoSource
    ) {
      const resource = this.mainSprite.texture.source.resource;
      console.log("DURATION", resource.duration, currentTime);
      if (resource.duration < currentTime) {
        if (this.state.timeFrom >= resource.duration) {
          resource.currentTime = 0;
        } else {
          resource.currentTime = this.state.timeFrom;
        }
      } else {
        resource.currentTime = currentTime;
      }
    } else if (this.mainSprite instanceof GifSprite) {
      const gif = this.mainSprite as GifSprite;
      console.log("DURATION", gif.duration, currentTime);
      if (gif.duration / 1000 < currentTime) {
        if (this.state.timeFrom >= gif.duration / 1000) {
          gif.currentFrame = 0;
        } else {
          gif.currentFrame = Math.floor(
            this.state.timeFrom * GifSprite.defaultOptions.fps!
          );
        }
      } else {
        gif.currentFrame = Math.floor(
          currentTime * GifSprite.defaultOptions.fps!
        );
      }
    }
  }
}
