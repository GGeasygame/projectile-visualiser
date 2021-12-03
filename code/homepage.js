function createTrajectory(that) {
    let canvas = document.querySelector('#canvas');

    if (!canvas.getContext) {
        return;
    }
    let ctx = canvas.getContext('2d');

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    
    var g = 9.8;
    var t = Math.sqrt(2)*that.velocity.value / g;

    ctx.beginPath();
    ctx.moveTo(0, 0);


    for (var t2 = 0; t2 < t; t2 += 0.1) {
        var x = that.velocity.value*t2*Math.cos(that.angle.value);
        var y = that.velocity.value*t2*Math.sin(that.angle.value);
        var y = y-0.5*g*Math.pow(t2, 2);
        ctx.lineTo(x, -y);
        // alert("X: " + x + " Y: " + -y + " T: " + t2);
    }
    ctx.stroke();
}