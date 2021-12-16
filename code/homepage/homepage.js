function createProjectile(that) {
    if (typeof counter === 'undefined') {
        counter = 0;
    }

    if (typeof canvas === 'undefined') {
        canvas = getCanvas("canvas");
    }

    originalStateForm = document.getElementById('form').cloneNode(true);
    originalStateCanvas = document.getElementById('canvas').cloneNode(true);
    originalStateBody = document.body.cloneNode(true);

    ctx = canvas.getContext('2d');

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

    // display data to user
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
    return document.getElementById(canvasID);
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
    canvasH /= scale;

    console.log('canvasH: ' + canvasH + ' scale: ' + scale);

    if (typeof oldLines != 'undefined') {
        clearOldCanvas(canvas);
        redrawLines(ctx, scale, canvasH);
    }

    var points = [];

    var points = getPoints(travelTime, startVelocity, angle, g);

    if (typeof oldLines == 'undefined') {
        oldLines = [];
    }


    var pointsCopy = points;
    oldLines.push(pointsCopy);

    console.log('canvasH: ' + canvasH);
    for (var i = 0; i < points.length; i++) {
        points[i].y += canvasH;
        console.log('X: ' + points[i].x + ' Y: ' + points[i].y);
    }

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

function redrawLines(ctx, scale, canvasH) {
    console.log('oldLines');
    /*
    oldLines.forEach(element => element.forEach(element2 => {
        element2.x /= oldScale;
        element2.y /= oldScale;
    }));
    */
    var oldLinesCopy = oldLines;

    for (var i = 0; i < oldLinesCopy.length; i++) {
        var canvasHOldLines = canvasH - oldLinesCopy[i][0].y;
        console.log('canvasHOldLines: ' + canvasHOldLines);
        for (var j = 0; j < oldLinesCopy[i].length; j++) {
            oldLinesCopy[i][j].y += canvasHOldLines;
            console.log('X: ' + oldLinesCopy[i][j].x + ' Y: ' + oldLinesCopy[i][j].y);
        }

        ctx.strokeStyle = "black";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(scale, scale);
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
    document.getElementById('canvas').replaceWith(originalStateCanvas.cloneNode(true));
    if (typeof oldLines != 'undefined') { oldLines = []; }
    newProjectile();
}
function clearOldCanvas(canvas) {
    canvas.width += 0;
}

function viewAllTrajectories() {
    console.clear();
    var highestPoint = 0;
    var furthestPoint = 0;
    for(var i = 0; i  < dataArray.length; i++) {
        if (dataArray[i].maxH > highestPoint) {
            highestPoint = dataArray[i].maxH;
        }
        if (dataArray[i].range > furthestPoint) {
            furthestPoint = dataArray[i].range;
        }
        console.log('test'  + dataArray[i].range + ' ' + furthestPoint);
    }
    console.log(highestPoint + ' ' + furthestPoint);

    document.body.innerHTML = "";

    var body = document.getElementsByTagName("body")[0];


    var button = document.createElement('button');
    button.textContent = "Go Back";
    button.setAttribute("onclick", "goBack();")
    body.appendChild(button);


    var canvas = document.createElement('canvas');
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    body.appendChild(canvas);

    var ctx = canvas.getContext('2d');

    var scale = getScale(ctx, highestPoint, furthestPoint, canvas.width);

    var canvasH = canvas.height;
    canvasH = canvasH / scale;
    redrawLines(ctx, scale, canvasH);

}

function goBack() {
    location.reload();
}