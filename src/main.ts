import { FrakturedEditor } from "./fraktured_editor";
import "./style.css";
import { CreateShaderLayerButtonComponent } from "./ktu/ui/components/add_shader_layer";
import { CreateSpriteLayerButtonComponent } from "./ktu/ui/components/add_sprite_layer";
import EventDispatcher from "./ktu/ui/core/event_dispatcher";
import { LayersList } from "./ktu/ui/components/layers_list";
import { ExportStateButtonComponent } from "./ktu/ui/components/export_state";
import { LoadStateComponent } from "./ktu/ui/components/load_state";

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
  LayersList,
  ExportStateButtonComponent,
  LoadStateComponent,
};
