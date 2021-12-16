var imgData = localStorage['objectToPass'];
localStorage.removeItem('objectToPass');

imageInCanvas(imgData);

function imageInCanvas(imgData) {
ctx = document.getElementById('canvas').getContext('2d');

ctx.putImageData(imgData, 0, 0);
}