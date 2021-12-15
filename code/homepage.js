function createProjectile(that) {

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
    var scale = getScale(ctx, maxHeight, range, canvasW, canvasH);
    ctx.scale(scale, scale);

    if (typeof oldLines != 'undefined') {
        clearOldCanvas(canvasArray);
        redrawLines(ctx, oldLines, scale);
    }

    canvasH /= scale;
    canvasW /= scale;
    resetScale = 1 / scale;

    // showMeters(ctx, canvasH, canvasW, scale);


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

    var points = getPoints(travelTime, startVelocity, angle, g, canvasH);

    // }
    if (typeof oldLines == 'undefined') {
        oldLines = [];
    }
    oldLines.push(points);
    

    var i = 0;

    animate(ctx, points, i);
}



function getPoints(travelTime, startVelocity, angle, g, canvasH) {
    var points = [];
    for (var t = 0; t < travelTime; t += 0.1) {
        t.toFixed(2);
        var x = startVelocity * Math.cos(angle) * t;
        var y = startVelocity * Math.sin(angle) * t;
        y = y - 0.5 * g * Math.pow(t, 2);
        y = -y + canvasH;
        points.push({ x: x, y: y });
    }
    return points;
}

// Need to fix so meters show on seperate canvas
/*
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

function redrawLines(ctx, oldLines, scale) {
    var oldLinesCopy = oldLines;

    for (var i = 0; i < oldLinesCopy.length; i++) {

        console.log('BEFORE: 1st x: ' + oldLinesCopy[i][0].x + ' 1st y: ' + oldLinesCopy[i][0].y);
        for (var j = 0; j < oldLinesCopy[i].length; j++) {
            oldLinesCopy[i][j].x *= Math.pow(scale, 2);

            console.log('scale: ' + scale);
            oldLinesCopy[i][j].y /= scale;
        }
        console.log('AFTER: 1st x: ' + oldLinesCopy[i][0].x + ' 1st y: ' + oldLinesCopy[i][0].y);
        drawLine(ctx, oldLinesCopy[i], oldLinesCopy[i].length);
    }
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