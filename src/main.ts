import { FrakturedEditor } from "./fraktured_editor";
import "./style.css";
import { CreateShaderLayerButtonComponent } from "./ktu/ui/components/add_shader_layer";
import { CreateSpriteLayerButtonComponent } from "./ktu/ui/components/add_sprite_layer";
import EventDispatcher from "./ktu/ui/core/event_dispatcher";

declare global {
  interface Window {
    EventDispatcher: EventDispatcher;
  }
}

const editor = new FrakturedEditor(
  document.getElementById("canvas")!,
  document.getElementById("ui")!
);
editor.init();

export default {
  CreateShaderLayerButtonComponent,
  CreateSpriteLayerButtonComponent,
};
