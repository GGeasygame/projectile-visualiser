function createProjectile(that) {
    originalStateForm = document.getElementById('form').cloneNode(true);
    originalStateCanvas = document.getElementById('canvas').cloneNode(true);

    ctx = getCanvas();
    // get data from form
    const startVelocity = that.velocity.value;
    const angle = that.angle.value/100;
    const g = that.gravity.value;

    animateTrajectory(ctx, startVelocity, angle, g);
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

function animateTrajectory(ctx, startVelocity, angle, g) {
    clearform();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;    

    var canvasH =  canvas.height;
    var canvasW =  canvas.width;
    
    velocityCompY = startVelocity * Math.sin(angle);
    
    // calculate total time needed for the projectile to impact on ground
    const travelTime = 2 * velocityCompY / g;

    // calculate maximum height and the range of the projectile
    var maxHeight = Math.pow(startVelocity, 2) * Math.pow(Math.sin(angle), 2) / (2 * g);
    var range = Math.pow(startVelocity, 2)*Math.sin(2*angle)/g;
    console.log("maxHeight: " + maxHeight + " range: " + range);

    // adjust zoom according to the height and range of the trajectory
    
    var scale = zoom(ctx, maxHeight, range, canvasW, canvasH);
    canvasH /= scale;
    canvasW /= scale;
    
    alert("scale: " + scale + " maxHeight: " + maxHeight + " range: " + range + " canvasW: " + canvasW + " canvasH: " + canvasH);

    var points = [];
    // begin drawing and calculating the projectile trajectory
    // The angle isn't calcuted correctly yet
    for (var t = 0; t < travelTime; t += 0.1) {
        var x = startVelocity*Math.cos(angle)*t;
        var y = startVelocity*Math.sin(angle)*t;
        y = y - 0.5 * g * Math.pow(t, 2);
        y = -y + canvasH;
        points.push({x:x, y:y});
    }





    var i = 0;

    animate(ctx, points, i);
}

function zoom(ctx, maxHeight, range, canvasW, canvasH) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var scale = 1;

    while (maxHeight * scale > canvasH || range  * scale > canvasW) {
        scale -= 0.001;
    }
    ctx.scale(scale, scale);
    return scale;
}


function animate(ctx, points, i, fps) {
    // Using requestanimationframe to create a smooth animation
    if (i < points.length) {
        requestAnimationFrame(function() {
            animate(ctx, points, i);
        });

    }
    drawLine(ctx, points, i);
    i++;
    console.log("i: " + i + " points: " + points.length);
}
function drawLine(ctx, points, i) {
    ctx.beginPath();
    
    for (var j = 1; j < i; j++) {
        ctx.moveTo(points[j-1].x, points[j-1].y);
        ctx.lineTo(points[j].x, points[j].y);
    }
    ctx.stroke();
}

function clearform() {
    document.getElementById('form').innerHTML="";
}
function newProjectile() {
    document.getElementById('form').replaceWith(originalStateForm.cloneNode(true));
}
function clearCanvas() {
    document.getElementById('canvas').replaceWith(originalStateCanvas.cloneNode(true));
}