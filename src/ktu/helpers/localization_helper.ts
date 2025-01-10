const texts: Record<string, string> = {
  test: "Test Text",
  add_bnw_shader_button: "B&W",
  add_pixelate_shader_button: "Pixelate",
  add_vintage_shader_button: "Vintage",

  export_state: "Save File",
  import_state: "Import File",
  open_state: "Open File",
  new_state: "New File",
  change: "Change",
};

export const getText = (key: string): string => {
  return texts[key];
};
