const texts: Record<string, string> = {
  test: "Test Text",
  add_bnw_shader_button: "Add Black&White Shader",
  add_pixelate_shader_button: "Add Pixelate Shader",
  add_vintage_shader_button: "Add Vintage Shader",
};

export const getText = (key: string): string => {
  return texts[key];
};
