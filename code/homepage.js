function createProjectile(that) {

    alert('hi');

    if (typeof counter === 'undefined') {
        counter = 0;
    }

    if (typeof canvasArray === 'undefined') {
        var canvasArray = [];
    }
    

    originalStateForm = document.getElementById('form').cloneNode(true);
    originalStateCanvas = document.getElementById('canvas').cloneNode(true);

    

    ctx = getCanvas('canvas');

    // get data from form
    const startVelocity = parseFloat(that.velocity.value);
    const g = parseFloat(that.gravity.value);

    var angle;

    angle = parseFloat(that.angle.value * Math.PI / 180);

    // get angle if only distance is provided
    if (angle === 0 && that.impact.value != 0) {
        var impact = that.impact.value;
        var temp = g * impact;
        var temp = temp / Math.pow(startVelocity, 2);
        angle = 0.5 * Math.asin(temp);
    }


    hideCheckbox = document.getElementById('hide');



    velocityCompY = startVelocity * Math.sin(angle);
    velocityCompX = startVelocity * Math.cos(angle);
    var maxHeight = Math.pow(startVelocity, 2) * Math.pow(Math.sin(angle), 2) / (2 * g);
    const travelTime = 2 * velocityCompY / g;
    var range = velocityCompX * travelTime;


    animateTrajectory(ctx, startVelocity, angle, g, maxHeight, range, travelTime);

    if (typeof dataArray == 'undefined')
        dataArray = [];
    dataArray.push({ maxH: maxHeight, range: range, ttime: travelTime, angle: angle });

    htmlData = document.getElementById('datalists');
    var i = dataArray.length - 1;
    var j = dataArray.length;

    htmlData.innerHTML +=
        'Trajectory ' + j + '<br>' +
        'Maximum Height: ' + Math.round(dataArray[i].maxH) + 'm<br>' +
        'range: ' + Math.round(dataArray[i].range) + 'm<br>' +
        'Traveltime: ' + Math.round(dataArray[i].ttime) + 's<br>' +
        'angle: ' + Math.round(dataArray[i].angle * 180 / Math.PI) + '<br><br>'
    ;


    document.getElementById('dataField').style.display = "block";

    counter++;

}


function getCanvas(canvasID) {
    // get canvas
    let canvas = document.querySelector('#' + canvasID);
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

    /*
    var stoke = document.getElementById('stoke');
    if (stoke.checked) {
        for (var t = 0; t < travelTime; t += 0.1) {
            t.toFixed(2);

            var x = velocityCompX/1.81*Math.pow(10, -5);
            var x2 = 1.81*Math.pow(10, -5)*t;
            var x3 = Math.pow(2.71828, -(x2));
            var x = x * (1-x2);
            
            var y = -(g/1.81*Math.pow(10, -5));
            var y = y*t+1/1.81*Math.pow(10, -5);
            var y2 = velocityCompY+g/1.81*Math.pow(10, -5);
            var y3 = 1.81*Math.pow(10, -5)*t;
            var y4 = 1-Math.pow(2.71828, -(y3));
            var y = y*(y2)*(y4);

            y = -y + canvasH;

            points.push({ x: x, y: y });
        }
    } else {
    */
    for (var t = 0; t < travelTime; t += 0.1) {
        t.toFixed(2);
        var x = startVelocity * Math.cos(angle) * t;
        var y = startVelocity * Math.sin(angle) * t;
        y = y - 0.5 * g * Math.pow(t, 2);
        y = -y + canvasH;
        points.push({ x: x, y: y });
    }
    // }
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
        ctx.lineTo(i, canvasH - 5 / scale);

    }
    for (var i = 100; i < canvasH; i += 100) {
        ctx.moveTo(0, i);
        ctx.lineTo(5 / scale, i);
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