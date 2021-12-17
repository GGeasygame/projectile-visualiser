function createProjectile(that) {

    if (!userInputValidation(that)) {
        return false;
    }


    if (typeof counter === 'undefined') {
        counter = 0;
    }

    if (typeof canvas === 'undefined') {
        canvas = getCanvas("canvas");
    }
    // save original state of html so I can reset after changes
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
    if (angle === 0 && that.distance.value != 0) {
        var distance = that.distance.value;
        var temp = g * distance;
        var temp = temp / Math.pow(startVelocity, 2);
        angle = 0.5 * Math.asin(temp);
    }

    // Calculate data from projectile for later use
    velocityCompY = startVelocity * Math.sin(angle);
    velocityCompX = startVelocity * Math.cos(angle);
    var maxHeight = Math.pow(startVelocity, 2) * Math.pow(Math.sin(angle), 2) / (2 * g);
    const travelTime = 2 * velocityCompY / g;
    var distance = velocityCompX * travelTime;


    animateTrajectory(startVelocity, angle, g, maxHeight, distance, travelTime);

    // display data to user
    if (typeof dataArray == 'undefined')
        dataArray = [];
    dataArray.push({ maximum_height: maxHeight, distance: distance, travel_time: travelTime, angle: angle * 180 / Math.PI });

    htmlData = document.getElementById('datalists');

    var content = '';
    for (var i = 0; i < dataArray.length; i++) {
        var count = i + 1;
        content += '<div class="data-element">Trajectory ' + count + '<br>';
        for (var j = 0; j < Object.keys(dataArray[i]).length; j++) {

            content += Object.keys(dataArray[i])[j] + ': ' + Math.round(dataArray[i][Object.keys(dataArray[i])[j]]);
            content += '<br>';
        }
        content += '</div>';
    }

    htmlData.innerHTML = "<p>" + content + "</p>";



    document.getElementById('dataField').style.display = "block";
    var dataLists = document.getElementById('datalists');
    dataLists.style.display = "flex";
    dataLists.style.justifyContent = "flex-start";
    dataLists.style.flexWrap = "wrap";
    dataLists.style.flexDirection = "row";
    


    counter++;

}


function getCanvas(canvasID) {
    return document.getElementById(canvasID);
}

function animateTrajectory(startVelocity, angle, g, maxHeight, range, travelTime) {
    clearform();
    ctx.strokeStyle = 'red';

    // get hight/width of canvas
    var canvasH = canvas.height;
    var canvasW = canvas.width;


    // adjust zoom according to the height and range of the trajectory
    if (typeof scale != 'undefined') { oldScale = scale; }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (typeof scale != 'undefined') { var oldScale = scale; }
    scale = getScale(ctx, maxHeight, range, canvasW, canvasH);
    ctx.scale(scale, scale);
    canvasH /= scale;

    // redraw the old trajectories so they're scaled right
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


    for (var i = 0; i < points.length; i++) {
        points[i].y += canvasH;
    }

    var i = 0;
    // Scroll to bottom of page so user doesn't have to do it
    var scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
    animate(ctx, points, i);
}

function getPoints(travelTime, startVelocity, angle, g) {
    var points = [];
    // calculate x- and y-axis at point in time t
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
    var scale = 2;
    // make scale smaller until it the whole trajectory is visible on canvas
    while (maxHeight * scale > canvasH || range * scale > canvasW) {
        scale -= 0.001;
    }
    ctx.lineWidth = 1 / scale;
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
    ctx.lineWidth = 1 / scale;
    var oldLinesCopy = oldLines;

    // redraw trajectories
    for (var i = 0; i < oldLinesCopy.length; i++) {
        var canvasHOldLines = canvasH - oldLinesCopy[i][0].y;
        for (var j = 0; j < oldLinesCopy[i].length; j++) {
            oldLinesCopy[i][j].y += canvasHOldLines;
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

    // draw lines from points in array, length is specified by point i in array
    for (var j = 1; j < i; j++) {
        ctx.moveTo(points[j - 1].x, points[j - 1].y);
        ctx.lineTo(points[j].x, points[j].y);

    }
    ctx.stroke();
}

function clearform() {
    // clear form
    document.getElementById('form').innerHTML = "";
}
function newProjectile() {
    // reset the form with a clone of the clone made earlier
    // Using try and catch in case user hasn't entered projectile yet
    try {
        document.getElementById('form').replaceWith(originalStateForm.cloneNode(true));
    } catch (err) {
        if (err instanceof ReferenceError) {
            // create error message
            var errorBox = document.getElementById('errorBox');
            errorBox.innerHTML = '<ul class="error-box-list"><li>Enter Your Projectile Information</li></ul>';
            document.getElementById('errorBox').style.display = "block";
        }
    }
}
function clearOldCanvas(canvas) {
    // clear canvas by adjusting its width
    canvas.width += 0;
}

function viewAllTrajectories() {
    // Using try and catch in case user hasn't entered trajectory yet
    try {
        console.clear();
        var highestPoint = 0;
        var furthestPoint = 0;

        // get the highest and furthest point of all trajectories
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].maximum_height > highestPoint) {
                highestPoint = dataArray[i].maximum_height;
            }
            if (dataArray[i].distance > furthestPoint) {
                furthestPoint = dataArray[i].distance;
            }
        }

        // clear whole html
        document.body.innerHTML = "";

        // get body of html
        var body = document.getElementsByTagName("body")[0];

        // create "go back"-button
        var button = document.createElement('button');
        button.textContent = "Go Back";
        button.setAttribute("onclick", "reloadPage();")
        body.appendChild(button);

        // create canvas
        var canvas = document.createElement('canvas');
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        body.appendChild(canvas);

        // redraw the trajectories onto the canvas
        var ctx = canvas.getContext('2d');
        var scale = getScale(ctx, highestPoint, furthestPoint, canvas.width);
        var canvasH = canvas.height;
        canvasH = canvasH / scale;
        redrawLines(ctx, scale, canvasH);
    } catch (err) {
        if (err instanceof ReferenceError) {
            //display error message
            var errorBox = document.getElementById('errorBox');
            errorBox.innerHTML = '<ul class="error-box-list"><li>Cannot Show Trajectories If There is None. Enter Trajectory</li></ul>';
            document.getElementById('errorBox').style.display = "block";
        }
    }
}

function reloadPage() {
    location.reload();
}

function userInputValidation(that) {

    //get all information from form
    var velocity = that.velocity.value;
    var angle = that.angle.value;
    var gravity = that.gravity.value;
    var distance = that.distance.value;

    var err = [];

    // check if informations are numeric
    if (isNaN(velocity)) { err.push('Velocity Must Be A Number'); }
    if (isNaN(gravity)) { err.push('Gravitation Must Be A Number'); }
    if (angle != '' && distance != '') {
        err.push('You Must Not Enter Both Angle And Distance');
    }
    else {
        if (isNaN(angle) && angle != '') { err.push('Angle Must Be A Number'); }
        if (isNaN(distance) && distance != '') { err.push('Distance Must Be A Number'); }
    }
    // check if all information is provided
    if (velocity == '') { err.push('You Must Enter A Value For Velocity'); }
    if (gravity == '') { err.push('You Must Enter A Value For Gravitation'); }
    if (angle == '' && distance == '') { err.push('You Must Enter A Value For Either The Angle Or The Distance') }

    // display error messages
    var errorBoxContent = "";
    err.forEach(element => {
        errorBoxContent += "<li>" + element + "</li>";
    });
    errorBoxContent = '<ul class="error-box-list">' + errorBoxContent + '</ul>';

    if (err.length != 0) {
        document.getElementById('errorBox').innerHTML = errorBoxContent;
        document.getElementById('errorBox').style.display = "block";
        return false;
    } else {
        document.getElementById('errorBox').style.display = "none";
        return true;
    }
}

function showTutorial() {
    // show tutorial by setting the css for display to block
    var button = document.getElementById('showTutorialButton');
    var tutorial = document.getElementById('tutorial');
    tutorial.style.display = "block";
    // change text on button and "onclick"-attribute
    button.textContent = "Hide Tutorial";
    button.setAttribute('onclick', 'hideTutorial();');
}
function hideTutorial() {
    // hide tutorial by setting the css for display to none
    var button = document.getElementById('showTutorialButton');
    var tutorial = document.getElementById('tutorial');
    tutorial.style.display = "none";
    // change text on button and "onclick"-attribute
    button.textContent = "Show Tutorial";
    button.setAttribute('onclick', 'showTutorial();');
}