function createProjectile(that) {
    // originalState = $("#form").clone();
    ctx = getCanvas();
    // get data from form
    const startVelocity = that.velocity.value;
    const angle = that.angle.value/100;
    const g = that.gravity.value;

    drawTrajectory(ctx, startVelocity, angle, g);
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
function drawTrajectory(ctx, startVelocity, angle, g) {
    clearform();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;    
    // get canvas-height/width
    const canvasH =  canvas.height;
    const canvasW = canvas.width;
    
    velocityCompY = startVelocity * Math.sin(angle);
    
    // calculate total time needed for the projectile to impact on ground
    const travelTime = 2 * velocityCompY / g;

    ctx.beginPath();
    ctx.moveTo(0, canvasH);
    
    // begin drawing and calculating the projectile trajectory
    for (var t = 0; t < travelTime; t += 0.1) {
        var x = startVelocity*Math.cos(angle)*t;
        var y = startVelocity*Math.sin(angle)*t;
        y = y - 0.5 * g * Math.pow(t, 2);
        y = -y + canvasH;
        ctx.lineTo(x, y);

        console.log("X: ", x, " Y: ", y, " T2: ", t);
    }
    console.log("T: " + travelTime);

    ctx.stroke();
}

function clearform() {
    document.getElementById('form').innerHTML="";
}
function newProjectile() {
    $("#form").replaceWith(originalState.clone());
}