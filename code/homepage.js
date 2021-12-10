function createProjectile(that) {
    originalStateForm = document.getElementById('form').cloneNode(true);
    originalStateCanvas = document.getElementById('canvas').cloneNode(true);

    ctx = getCanvas();
    // get data from form
    const startVelocity = that.velocity.value;
    const angle = that.angle.value / 100;
    const g = that.gravity.value;
    hideCheckbox = document.getElementById('hide');



    var maxHeight = Math.pow(startVelocity, 2) * Math.pow(Math.sin(angle), 2) / (2 * g);
    var range = Math.pow(startVelocity, 2) * Math.sin(2 * angle) / g;

    velocityCompY = startVelocity * Math.sin(angle);
    const travelTime = 2 * velocityCompY / g;
    animateTrajectory(ctx, startVelocity, angle, g, maxHeight, range, travelTime);

    if (typeof dataArray == 'undefined')
    dataArray = [];
    dataArray.push({maxH:maxHeight,range:range,ttime:travelTime});

    htmlData = document.getElementById('data');
        var i = dataArray.length-1;
        var j = dataArray.length;
        htmlData.innerHTML +=
            'Trajectory ' + j + '<br>' + 
            'Maximum Height: ' + Math.round(dataArray[i].maxH) + 'm<br>' +
            'range: ' + Math.round(dataArray[i].range) + 'm<br>' + 
            'Traveltime: ' + Math.round(dataArray[i].ttime) + 's<br><br>'
        ;


    document.getElementById('dataField').style.display = "block";
}


function getCanvas() {
    // get canvas
    let canvas = document.querySelector('#canvas');
    if (!canvas.getContext) {
        return;
    }
    let ctx = canvas.getContext('2d');
    return ctx;
}

function animateTrajectory(ctx, startVelocity, angle, g, maxHeight, range, travelTime) {
    clearform();
    ctx.strokeStyle = 'red';

    var canvasH = canvas.height;
    var canvasW = canvas.width;



    // calculate total time needed for the projectile to impact on ground


    // calculate maximum height and the range of the projectile


    // adjust zoom according to the height and range of the trajectory
    var scale = getScale(ctx, maxHeight, range, canvasW, canvasH);
    ctx.scale(scale, scale);

    canvasH /= scale;
    canvasW /= scale;
    resetScale = 1 / scale;

    showMeters(ctx, canvasH, canvasW, scale);


    var points = [];
    // begin drawing and calculating the projectile trajectory
    // The angle isn't calculated correctly yet
    for (var t = 0; t < travelTime; t += 0.1) {
        t.toFixed(2);
        var x = startVelocity * Math.cos(angle) * t;
        var y = startVelocity * Math.sin(angle) * t;
        y = y - 0.5 * g * Math.pow(t, 2);
        y = -y + canvasH;
        points.push({ x: x, y: y });
    }
    if (typeof oldlines == 'undefined') {
        var oldlines = [];
    } else {
        oldlines.push(points);
    }
    var i = 0;

    animate(ctx, points, i);
}

function showMeters(ctx, canvasH, canvasW, scale) {
    ctx.strokeStyle = 'black';
    ctx.strokeWidth = 5 / scale;
    ctx.beginPath();
    ctx.moveTo(0, canvasH);
    for (var i = 100; i < canvasW; i += 100) {
        ctx.moveTo(i, canvasH);
        ctx.lineTo(i, canvasH - 10 / scale);
    }
    ctx.stroke();
    ctx.strokeStyle = 'red';
    ctx.strokeWidth = 1;
}

function getScale(ctx, maxHeight, range, canvasW, canvasH) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var scale = 1;

    while (maxHeight * scale > canvasH || range * scale > canvasW) {
        scale -= 0.001;
    }
    return scale;
}

function animate(ctx, points, i) {
    // Using requestanimationframe to create a smooth animation
    if (i < points.length) {
        requestAnimationFrame(function () {
            animate(ctx, points, i);
        });

    }
    drawLine(ctx, points, i);
    i++;
}
function drawLine(ctx, points, i) {
    ctx.beginPath();

    for (var j = 1; j < i; j++) {
        ctx.moveTo(points[j - 1].x, points[j - 1].y);
        ctx.lineTo(points[j].x, points[j].y);

    }
    ctx.stroke();
}

function clearform() {
    document.getElementById('form').innerHTML = "";
}
function newProjectile() {
    document.getElementById('form').replaceWith(originalStateForm.cloneNode(true));
    ctx.scale(resetScale, resetScale);

    // multiple projectiles added yet.
    document.getElementById('canvas').replaceWith(originalStateCanvas.cloneNode(true));

}
function clearCanvas() {
    document.getElementById('canvas').replaceWith(originalStateCanvas.cloneNode(true));
    newProjectile();
}