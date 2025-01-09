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

export type ImageLayerState = ContainerLayerState & {
  alpha: number;
  panX: number;
  panY: number;
  scale: number;
  imageUrl: string;
};

export type ImageLayerSetting = {
  field: "imageSource" | "alpha" | "panX" | "panY" | "scale";
  type: "file" | "float" | "integer";
  onchange: (value: string) => void;
};

export class ImageLayer extends ContainerLayer {
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
        console.log("Image Layer FILE", value);
        this.state.imageUrl = value;
        this.repaint();
      },
    },
    {
      field: "scale",
      type: "integer",
      onchange: (value) => {
        this.state.scale = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "panX",
      type: "integer",
      onchange: (value) => {
        this.state.panX = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "panY",
      type: "integer",
      onchange: (value) => {
        this.state.panY = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "alpha",
      type: "float",
      onchange: (value) => {
        this.state.alpha = parseFloat(value);
        this.repaint();
      },
    },
  ];

  constructor(state?: ImageLayerState) {
    super();
    this.sprite = new Sprite();
    this.container.addChild(this.sprite);

    if (state) {
      this.state = {
        ...this.state,
        alpha: state.alpha,
        panX: state.panX,
        panY: state.panY,
        scale: state.scale,
        imageUrl: state.imageUrl,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
      }
    }
  }

  layerName(): string {
    return "image_layer";
  }

  defaultState(): ImageLayerState {
    return {
      ...super.defaultState(),
      alpha: 1,
      panX: 0,
      panY: 0,
      scale: 100,
      imageUrl: "",
    };
  }

  pointerDown(event: FederatedPointerEvent): void {
    this.clicking = true;
    if (event.ctrlKey) {
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
      this.repaint();
      DataStore.getInstance().touch("layers");
    }
  }

  bind(container: Container): void {
    super.bind(container);
    this.repaint();
  }

  repaint() {
    this.container.removeChildren();
    this.sprite.destroy();
    if (this.state.imageUrl) {
      VideoSource.defaultOptions = {
        ...VideoSource.defaultOptions,
        loop: true,
      };
      const texturePromise = Assets.load<Texture>(this.state.imageUrl);
      texturePromise.then((resolvedTexture: Texture) => {
        this.sprite = Sprite.from(resolvedTexture);
        this.sprite.scale = this.state.scale / 100;
        this.sprite.x = this.state.panX;
        this.sprite.y = this.state.panY;
        this.sprite.alpha = this.state.alpha;
        this.container.addChild(this.sprite);
      });
    } else {
      this.sprite = new Sprite();
      this.container.addChild(this.sprite);
    }
  }
}
