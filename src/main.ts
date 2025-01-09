import { FrakturedEditor } from "./fraktured_editor";
import "./style.css";
import { CreateSpriteLayerButtonComponent } from "./ktu/ui/components/add_sprite_layer";
import EventDispatcher from "./ktu/ui/core/event_dispatcher";
import { LayersList } from "./ktu/ui/components/layers_list";
import { ExportStateButtonComponent } from "./ktu/ui/components/export_state";
import { LoadStateComponent } from "./ktu/ui/components/load_state";
import { CreateBackgroundLayerButtonComponent } from "./ktu/ui/components/add_background_layer";
import { CreateImageLayerButtonComponent } from "./ktu/ui/components/add_image_layer";
import { ShadersList } from "./ktu/ui/components/shaders_list";
import { CreateTextLayerButtonComponent } from "./ktu/ui/components/add_text_layer";

declare global {
  interface Window {
    EventDispatcher: EventDispatcher;
  }
}

const editor = new FrakturedEditor(
  document.getElementById("canvas")!,
  document.getElementById("ui")!
);
document.getElementById("start-app")?.addEventListener("click", () => {
  document.querySelector(".splash")!.className += " hidden";
  document.documentElement.requestFullscreen();
  document.addEventListener("fullscreenchange", () => {
    if (!editor.live) {
      console.log("FS HEIGHT", window.innerHeight);
      document.getElementById("app")!.className = document
        .getElementById("app")!
        .className.replace("hidden", "");
      editor.init();
    }
  });
});

export default {
  CreateSpriteLayerButtonComponent,
  CreateBackgroundLayerButtonComponent,
  LayersList,
  ExportStateButtonComponent,
  LoadStateComponent,
  CreateImageLayerButtonComponent,
  ShadersList,
  CreateTextLayerButtonComponent,
};
