import jsx from "texsaur";

export class EditorUI {
  anchor: HTMLElement;
  public constructor(anchor: HTMLElement) {
    this.anchor = anchor;
  }
  public init() {
    this.anchor.appendChild(
      <div>
        <create-sprite-layer-button></create-sprite-layer-button>
        <create-shader-layer-button></create-shader-layer-button>
      </div>
    );
  }
}
