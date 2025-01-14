import { Point, Sprite } from "pixi.js";
import { KeyboardManager } from "../helpers/keyboard_manager";

export class Camera {
  container: Sprite;
  clickStart?: Point;
  panStart?: Point;
  offset: Point;
  scaleOffset: number;
  moving: boolean;

  constructor(container: Sprite) {
    this.container = container;
    this.offset = new Point(0, 0);
    this.scaleOffset = 1;
    this.moving = false;
  }

  pointerDown(event: PointerEvent) {
    console.log("spacePressed", KeyboardManager.spacePressed);
    if (KeyboardManager.spacePressed) {
      this.moving = true;
      this.clickStart = new Point(event.clientX, event.clientY);
      this.panStart = new Point(this.offset.x, this.offset.y);
    }
  }
  pointerMove(event: PointerEvent) {
    if (this.moving) {
      this.offset.x = this.panStart!.x + (event.clientX - this.clickStart!.x);
      this.offset.y = this.panStart!.y + (event.clientY - this.clickStart!.y);
      this.reposition();
    }
  }
  pointerUp() {
    this.moving = false;
    this.clickStart = undefined;
  }

  scroll(event: WheelEvent) {
    if (event.ctrlKey) {
      console.log("scale", this.container.scale, this.container.scale.add);

      this.scaleOffset = this.scaleOffset - event.deltaY / 500;
    } else {
      this.offset.x = this.offset.x - event.deltaX;
      this.offset.y = this.offset.y - event.deltaY;
    }
    console.log("SIZE", this.container.getSize());
    this.reposition();
  }

  zoomIn() {
    this.scaleOffset = this.scaleOffset + 100 / 500;
    this.reposition();
  }

  zoomOut() {
    this.scaleOffset = this.scaleOffset - 100 / 500;
    this.reposition();
  }

  reposition() {
    this.container.x =
      this.offset.x +
      (window.innerWidth - window.innerWidth * this.scaleOffset) / 2;
    this.container.y =
      this.offset.y +
      (window.innerHeight - window.innerHeight * this.scaleOffset) / 2;
    this.container.scale = this.scaleOffset;
  }

  reset() {
    console.log("RESET");
    this.offset = new Point(0, 0);
    this.scaleOffset = 1;
    this.reposition();
  }
}
