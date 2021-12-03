function createTrajectory(that) {
    let canvas = document.querySelector('#canvas');

    if (!canvas.getContext) {
        return;
    }
    let ctx = canvas.getContext('2d');

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    
    var g = 9.8;

    ctx.beginPath();
    ctx.moveTo(0, 0);


        var x = that.velocity.value*t*Math.cos(that.angle.value);
        var y = that.velocity.value*t*Math.sin(that.angle.value);
        var y = y-0.5*g*Math.pow(t, 2);
        ctx.lineTo(x, y);
    
    ctx.stroke();
}