export const downloadContent = (filename: string, content: string) => {
  let element = document.createElement("a");
  element.setAttribute("href", content);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
