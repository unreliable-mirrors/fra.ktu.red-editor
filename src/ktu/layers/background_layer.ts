import { Container, Graphics } from "pixi.js";
import { ContainerLayer } from "./container_layer";

export type BackgroundLayerState = {
  name: string;
  layerId: string;
  color: number;
};

export class BackgroundLayer extends ContainerLayer {
  graphics: Graphics;
  state: BackgroundLayerState;

  constructor(state?: BackgroundLayerState) {
    super();
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);

    if (state) {
      this.state = {
        name: state.name,
        layerId: state.layerId,
        color: state.color,
      };
    } else {
      this.state = {
        name: "background_layer",
        layerId: this.layerId,
        color: 0x333333,
      };
    }
  }

  bind(container: Container): void {
    super.bind(container);
    this.repaint();
  }

  repaint() {
    this.graphics
      .rect(0, 0, this.parent!.width, this.parent!.height)
      .fill(this.state.color);
  }
}
