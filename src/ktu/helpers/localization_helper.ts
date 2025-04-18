const texts: Record<string, string> = {
  test: "Test Text",
  add_bnw_shader_button: "B&W",
  add_pixelate_shader_button: "Pixelate",
  add_vintage_shader_button: "Vintage",
  add_montecarlo_sample_shader_button: "Montecarlo",
  add_anaglyph_shader_button: "Anaglyph",
  add_posterize_shader_button: "01Posterize",
  add_dots_shader_button: "Dots",
  add_vlines_shader_button: "vLines",
  add_hlines_shader_button: "hLines",
  add_grid_shader_button: "Grid",
  add_chroma_shader_button: "Chroma Key",
  add_scramble_shader_button: "Scramble",
  add_negative_shader_button: "Negative",
  add_crosses_shader_button: "Crosses",
  add_recolour_shader_button: "Recolour",
  add_hnoise_lines_shader_button: "hNoise Lines",
  add_light_split_shader_button: "Light Split",
  add_alpha_shader_button: "Alpha",
  add_multi_posterize_shader_button: "MultiPosterize",

  export_state: "Save File",
  import_state: "Import File",
  open_state: "Open File",
  new_state: "New File",
  change: "Change",
  export_canvas: "Download as PNG",
  export_viewport: "Download Viewport",
};

export const getText = (key: string): string => {
  return texts[key];
};
