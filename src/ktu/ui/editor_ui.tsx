import jsx from "texsaur";

export class EditorUI {
  anchor: HTMLElement;
  public constructor(anchor: HTMLElement) {
    this.anchor = anchor;
  }
  public init() {
    this.anchor.appendChild(
      <div>
        <create-background-layer-button></create-background-layer-button>
        <create-sprite-layer-button></create-sprite-layer-button>
        <create-image-layer-button></create-image-layer-button>
        <export-state-button></export-state-button>
        <load-state></load-state>
        <layers-list binding="layers"></layers-list>
      </div>
    );
  }
}
