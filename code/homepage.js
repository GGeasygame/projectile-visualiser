function createProjectile(that) {
    originalState = document.getElementById('form').cloneNode(true);
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

    const canvasH =  canvas.height;
    
    velocityCompY = startVelocity * Math.sin(angle);
    
    // calculate total time needed for the projectile to impact on ground
    const travelTime = 2 * velocityCompY / g;


    
    var points = [];
    // begin drawing and calculating the projectile trajectory
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
function animate(ctx, points, i) {

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
    document.getElementById('form').replaceWith(originalState.cloneNode(true));
}
function clearCanvas() {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}