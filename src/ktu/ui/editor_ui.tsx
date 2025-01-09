import jsx from "texsaur";

export class EditorUI {
  anchor: HTMLElement;
  public constructor(anchor: HTMLElement) {
    this.anchor = anchor;
  }
  public init() {
    this.anchor.appendChild(
      <div>
        <layers-list binding="layers"></layers-list>
        <shaders-list binding="shaders"></shaders-list>
        <h3>Save/Load</h3>
        <export-state-button></export-state-button>
        <load-state></load-state>
      </div>
    );
  }
}
