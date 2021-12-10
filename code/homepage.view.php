<?php include "./homepage.model.php"; ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projectile Visualiser</title>
    <link rel="stylesheet" href="homepage.css">
    <script type="text/javascript" src="./homepage.js"></script>
</head>

<body>
    <div id="form">
        <h1>Projectile Visualiser</h1>
        <fieldset>
            <legend>Enter Projectile Data and Circumstances Data</legend>
            <form action="" onsubmit="createProjectile(this); return false;">
                <label for="velocity">Starting Velocity</label>
                <input type="text" name="velocity" class="velocity-input">
                <br>
                <label for="angle">Starting Angle</label>
                <input type="text" name="angle" class="angle-input">
                <br>
                <label for="gravity">Acting Gravitation</label>
                <input type="text" name="gravity" class="gravity-input" value="9.8">
                <input type="submit" value="Start Simulation">
            </form>
        </fieldset>
    </div>
    <fieldset id="dataField">
            <legend>Data</legend>
            <ul id="data">

            </ul>
        </fieldset>
    <canvas id="canvas"></canvas>
    <button onclick="newProjectile();">create new projectile</button>
    <button onclick="clearCanvas();">Reset Projectiles</button>
    <label for="hide">
        <input type="checkbox" id="hide" name="hide">Only show the projectile
    </label>
</body>

</html>