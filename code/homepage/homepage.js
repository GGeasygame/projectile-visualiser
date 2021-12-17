function createProjectile(that) {
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

    if (!userInputValidation(that, angle)) {
        return false;
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
    dataArray.push({ maximum_height_m: maxHeight, distance_m: distance, travel_time_s: travelTime, angle_degree: angle * 180 / Math.PI });

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
    
    // Scroll to bottom of page so user doesn't have to do it
    var scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;

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
    canvasW /= scale;

    

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


    var metersgap = showMeters(ctx, scale, canvasW, canvasH, maxHeight, range);
    var showMetersContent = 'Line Every: ' + metersgap + 'm'
    document.getElementById('showMeters').innerHTML = showMetersContent;
    animate(ctx, points, i);
}

function showMeters(ctx, scale, canvasW, canvasH, maxHeight, range) {
    ctx.strokeStyle = "black";
    var meterLineLength = 10 / scale;
    var gap = 100;
    var heighest = maxHeight > range ? maxHeight : range;
    var count = 0;
    var limit = 5;
    var add = 100;
 
    // calculate gap between the lines (lines should have nice proportions to the trajectory)
    while (gap * 5 < heighest) {
        for (var i = gap; i < heighest; i += gap) {
            count++
            if (count == limit) {
                gap += add;
                count = 0;
                break;
            }
        }
        if (gap >= 1000) { add = 500; }
    } 

    // draw lines on the x-axis
    for (var i = gap; i < canvasW; i += gap) {
        ctx.beginPath();
        ctx.moveTo(i, canvasH);
        ctx.lineTo(i, canvasH - meterLineLength);
        ctx.stroke();
    }
    // draw lines on the y-axis
    for (var i = gap; i < canvasH; i += gap) {
        ctx.beginPath();
        ctx.moveTo(0, canvasH - i);
        ctx.lineTo(meterLineLength, canvasH - i);
        ctx.stroke();
    }
    ctx.strokeStyle = "red";
    return gap;
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
            if (dataArray[i].maximum_height_m > highestPoint) {
                highestPoint = dataArray[i].maximum_height;
            }
            if (dataArray[i].distance_m > furthestPoint) {
                furthestPoint = dataArray[i].distance_m;
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
            errorBox.innerHTML = '<ul class="error-box-list"><li>Cannot Show Trajectories If There is None. Enter Projectile</li></ul>';
            document.getElementById('errorBox').style.display = "block";
        }
    }
}

function reloadPage() {
    location.reload();
}

function userInputValidation(that, calculatedAngle) {

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

    if (velocity / gravity > 100) { err.push('You Must Enter A Lower Velocity Or A Higher Gravitational Force (The Velocity Devided By Gravitational Force Cannot Be Higher Than 100)'); }
    if (angle > 90 || angle < 0) { err.push('You Must Enter A Angle In The Allowed Range (Allowed Range is between 0 and 90 degrees)'); }
    if (isNaN(calculatedAngle)) { err.push('The Entered Distance is to high. Please Enter A Lower Distance or Higher Velocity'); }
    if(gravity <= 0) { err.push('The gravity must be a positive number'); }

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