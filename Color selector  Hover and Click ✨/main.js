let hex = "#000000"

canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// First gradient with colors
let gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0);
gradient.addColorStop(0,    "rgb(255,   0,   0)");
gradient.addColorStop(0.15, "rgb(255,   0, 255)");
gradient.addColorStop(0.33, "rgb(0,     0, 255)");
gradient.addColorStop(0.49, "rgb(0,   255, 255)");
gradient.addColorStop(0.67, "rgb(0,   255,   0)");
gradient.addColorStop(0.84, "rgb(255, 255,   0)");
gradient.addColorStop(1,    "rgb(255,   0,   0)");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

// Then white/black (horizontal)
gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

let h1 = document.getElementById('hex');


function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}


canvas.addEventListener('mousemove', function(event) {
	let x = event.pageX
	let y = event.pageY
	let c = ctx.getImageData(x, y, 1, 1).data
	hex = "#" + ("000000" + rgbToHex(c[0], c[1], c[2])).slice(-6)
	document.getElementById('hex').textContent = hex
	
	h1.style.left = x + "px"
	h1.style.top =  y + "px"
})

canvas.addEventListener('click', function(event) {
	navigator.clipboard.writeText(hex)
	this.style.cursor = "not-allowed"
	let m = document.getElementById('copied')
	m.querySelector('h1').textContent = hex
	m.style.background = hex
	m.classList.add('appear')
	setTimeout(function() {
			m.classList.remove('appear')
			document.querySelector("canvas").style.cursor = "crosshair"

	}, 3001)
})

// Sources :
/*
https://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mousemove
https://sparkbox.com/foundry/how_i_built_a_canvas_color_picker
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
*/