import jsx from "texsaur";

export class EditorUI {
  anchor: HTMLElement;
  public constructor(anchor: HTMLElement) {
    this.anchor = anchor;
  }
  public init() {
    this.anchor.appendChild(
      <div>
        <div className="left-ui">
          <h3>Open/Save</h3>
          <load-state></load-state>
          <export-state-button></export-state-button>
        </div>
        <div className="right-ui">
          <layers-list binding="layers"></layers-list>
          <shaders-list binding="shaders"></shaders-list>
        </div>
      </div>
    );
  }
}
