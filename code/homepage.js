function createProjectile(that) {

    console.clear();

    if (typeof counter === 'undefined') {
        counter = 0;
    }

    if (typeof canvasArray === 'undefined') {
        canvasArray = [];
    }


    originalStateForm = document.getElementById('form').cloneNode(true);


    canvasID = 'canvas' + counter + 1;
    canvasArray.push(createNewCanvas(canvasID));

    originalStateCanvas = document.getElementById(canvasID).cloneNode(true);

    ctx = canvasArray[counter].getContext('2d');



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


    animateTrajectory(startVelocity, angle, g, maxHeight, range, travelTime);

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


function createNewCanvas(canvasID) {
    canvas = document.createElement('canvas');

    canvas.id = canvasID;
    canvas.className = "projectile-layers";

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    return canvas;
}

function animateTrajectory(startVelocity, angle, g, maxHeight, range, travelTime) {
    clearform();
    ctx.strokeStyle = 'red';

    var canvasH = canvas.height;
    var canvasW = canvas.width;

    // adjust zoom according to the height and range of the trajectory
    if (typeof scale != 'undefined') { oldScale = scale; }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (typeof scale != 'undefined') { var oldScale = scale; }
    scale = getScale(ctx, maxHeight, range, canvasW, canvasH);
    ctx.scale(scale, scale);


    canvasH *= scale;
    canvasW *= scale;
    if (typeof oldLines != 'undefined') {
        clearOldCanvas(canvasArray);
        redrawLines(ctx, scale, canvasH, oldScale);
    }



    // showMeters(scale);


    var points = [];

    var points = getPoints(travelTime, startVelocity, angle, g);

    if (typeof oldLines == 'undefined') {
        oldLines = [];
    }

    for (var i = 0; i < points.length; i++) {
        points[i].y += canvasH;
    }

    var pointsCopy = points;
    oldLines.push(pointsCopy);


    console.log('canvas.height: ' + canvas.height + ' canvasH: ' + canvasH);
    points.forEach(element => console.log('New Points: X: ' + element.x + ' Y: ' + element.y));

    var i = 0;

    animate(ctx, points, i);
}



function getPoints(travelTime, startVelocity, angle, g) {
    var points = [];
    for (var t = 0; t < travelTime; t += 0.1) {
        t.toFixed(2);
        var x = startVelocity * Math.cos(angle) * t;
        var y = startVelocity * Math.sin(angle) * t;
        y = y - 0.5 * g * Math.pow(t, 2);
        y = -y;
        points.push({ x: x, y: y });
    }


    return points;
}

// Need to fix so meters show on seperate canvas
/*
function showMeters(scale) {

    canvasMeters = document.createElement('canvas');

    canvasMeters.id = "meter-canvas";
    canvasMeters.className = "projectile-layers";

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvasMeters);
    ctxMeters = canvasMeters.getContext('2d');

    ctxMeters.setTransform(1, 0, 0, 1, 0, 0);
    ctxMeters.scale(scale, scale);

    ctxMeters.strokeStyle = 'black';
    ctxMeters.strokeWidth = 10;
    ctxMeters.beginPath();
    ctxMeters.moveTo(0, canvasMeters.height);
    for (var i = 100; i < canvasMeters.width; i += 100) {
        ctx.moveTo(i, canvasMeters.height);
        ctx.lineTo(i, canvasMeters.height - 10);
    }
    for (var i = 100; i < canvasMeters.height; i += 100) {
        ctx.moveTo(0, i);
        ctx.lineTo(10, i);
    }
    ctxMeters.stroke();
}
*/

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

function clearOldCanvas(canvasArray) {
    for (var i = 0; i < canvasArray.length; i++) {
        if (canvasArray[i].getContext('2d') != ctx) {
            canvasArray[i].width += 0;
        }
    }
}

function redrawLines(ctx, scale, canvasH, oldScale) {
    console.log('new Scale: ' + scale + ' old Scale: ' + oldScale);
    oldLines.forEach(element => element.forEach(element2 => {
        element2.x /= oldScale;
        element2.y /= oldScale;
        console.log('OLDLINES: X: ' + element2.x + ' Y: ' + element2.y);
    }));
    var oldLinesCopy = oldLines;

    ctx.strokeStyle = "black";
    for (var i = 0; i < oldLinesCopy.length; i++) {

        for (var j = 0; j < oldLinesCopy[i].length; j++) {
            oldLinesCopy[i][j].y = oldLinesCopy[i][j].y * scale;
            oldLinesCopy[i][j].x = oldLinesCopy[i][j].x * scale;
        }
        drawLine(ctx, oldLinesCopy[i], oldLinesCopy[i].length);
    }
    ctx.strokeStyle = "red";
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
}
function clearCanvas() {
    document.getElementById(canvasID).replaceWith(originalStateCanvas.cloneNode(true));
    newProjectile();
}