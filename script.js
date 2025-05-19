const canvas = document.getElementById("textCanvas");
const ctx = canvas.getContext("2d");

const input = document.getElementById("hindiInput");
const fontSelect = document.getElementById("fontSelect");
const fontSize = document.getElementById("fontSize");
const textAlign = document.getElementById("textAlign");
const bgColor = document.getElementById("bgColor");
const uploadFont = document.getElementById("uploadFont");

let currentFont = "Josefin Sans";

// Load fonts from JSON
fetch("fonts.json")
  .then(res => res.json())
  .then(fonts => {
    fonts.forEach(font => {
      const option = document.createElement("option");
      option.value = font.name;
      option.textContent = font.name;
      option.style.fontFamily = font.name;
      fontSelect.appendChild(option);

      // Load font dynamically
      const fontFace = new FontFace(font.name, `url(${font.url})`);
      fontFace.load().then(loaded => {
        document.fonts.add(loaded);
      });
    });
  });

fontSelect.addEventListener("change", () => {
  currentFont = fontSelect.value;
  renderText();
});

fontSize.addEventListener("input", renderText);
textAlign.addEventListener("change", renderText);
bgColor.addEventListener("input", renderText);
input.addEventListener("input", renderText);

uploadFont.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const font = new FontFace(file.name, `url(${reader.result})`);
    font.load().then(loadedFont => {
      document.fonts.add(loadedFont);
      const option = document.createElement("option");
      option.value = file.name;
      option.textContent = file.name + " (uploaded)";
      option.selected = true;
      fontSelect.appendChild(option);
      currentFont = file.name;
      renderText();
    });
  };
  reader.readAsDataURL(file);
});

function renderText() {
  const text = input.value;
  const size = fontSize.value;
  const align = textAlign.value;
  const bg = bgColor.value;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.height; // reset height
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${size}px "${currentFont}"`;
  ctx.textAlign = align;
  ctx.fillStyle = "#000";

  const x = align === "left" ? 10 : align === "right" ? canvas.width - 10 : canvas.width / 2;
  const yStart = 50;
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    ctx.fillText(line, x, yStart + i * (parseInt(size) + 10));
  });
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "hindi-text.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Social Share
document.getElementById("shareFb").href = `https://www.facebook.com/sharer/sharer.php?u=${location.href}`;
document.getElementById("shareWa").href = `https://wa.me/?text=${encodeURIComponent(location.href)}`;
document.getElementById("shareTw").href = `https://twitter.com/intent/tweet?url=${location.href}`;

