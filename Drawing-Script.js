//Gloabal variables
isDrawing = false;
brushWidth = 3;
selectedTool = "move";
selectedShape = "rectangle";
selectedColor = "#000";
operationArray = [];
index = -1;
let prevMouseX, prevMouseY, snapshot;

//Selecting tools & options
const tools = document.querySelectorAll("i");
const saveCanvas = document.querySelector("#save");
const clearCanvas = document.querySelector("#delete");
const colorPicker = document.querySelector("#color");
const pencilSize = document.querySelector("#pencil_size");
const eraserSize = document.querySelector("#eraser_size");
const shapes = document.querySelectorAll(".shapes img");
const undo = document.querySelector("#undo");
const redo = document.querySelector("#redo");

tools.forEach((tool) => {
  tool.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    tool.classList.add("active");
    selectedTool = tool.id;
    console.log(selectedTool);
  });
});

shapes.forEach((shape) => {
  selectedTool = "shapes_picker";
  shape.addEventListener("click", () => {
    selectedShape = shape.id;
    console.log(selectedShape);
  });
});

//Drawing canvas and pencil tool
const canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;

  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "pencil" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "shapes_picker") {
    if (selectedShape === "rectangle") drawRect(e);
    else if (selectedShape === "circle") drawCircle(e);
    else if (selectedShape === "triangle") drawTriangle(e);
  }
};

const endDraw = (e) => {
  ctx.closePath();
  isDrawing = false;
  if (e.type !== "mouseout") {
    operationArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index++;
    //   console.log(operationArray);
  }
};

canvas.addEventListener("touchstart", startDraw, false);
canvas.addEventListener("touchmove", drawing, false);
canvas.addEventListener("mousedown", startDraw, false);
canvas.addEventListener("mousemove", drawing, false);
canvas.addEventListener("touchend", endDraw, false);
canvas.addEventListener("mouseup", endDraw, false);
canvas.addEventListener("mouseout", endDraw, false);

//Shape tool
//Rectangle
const drawRect = (e) => {
  return ctx.strokeRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

//Circle
const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

//Triangle
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  ctx.stroke();
};

//Pencil size
pencilSize.addEventListener("change", () => {
  brushWidth = pencilSize.value;
});

//Eraser size
eraserSize.addEventListener("change", () => {
  brushWidth = eraserSize.value;
});

//Color picker
colorPicker.addEventListener("change", () => {
  selectedColor = colorPicker.value;
  //   console.log(selectedColor);
});

//Undo
undo.addEventListener("click", () => {
  if (index <= 0) {
    clearCanvas.click();
  } else {
    index--;
    ctx.putImageData(operationArray[index], 0, 0);
  }
});

//Redo
redo.addEventListener("click", () => {
  if (index >= operationArray.length - 1) return;
  else {
    index++;
    ctx.putImageData(operationArray[index], 0, 0);
  }
});

//Clear canvas
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  operationArray = [];
  index = -1;
});

//Save canvas
saveCanvas.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
});
