const texts: Record<string, string> = {
  test: "Test Text",
  add_bnw_shader_button: "B&W",
  add_pixelate_shader_button: "Pixelate",
  add_vintage_shader_button: "Vintage",
  add_montecarlo_sample_shader_button: "Montecarlo",
  add_anaglyph_shader_button: "Anaglyph",
  add_posterize_shader_button: "Posterize",
  add_dots_shader_button: "Dots",
  add_vlines_shader_button: "vLines",
  add_hlines_shader_button: "hLines",
  add_grid_shader_button: "Grid",
  add_noblack_shader_button: "Chroma Key",

  export_state: "Save File",
  import_state: "Import File",
  open_state: "Open File",
  new_state: "New File",
  change: "Change",
  export_canvas: "Download as PNG",
};

export const getText = (key: string): string => {
  return texts[key];
};
