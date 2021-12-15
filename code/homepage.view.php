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
                <label for="velocity">Starting Velocity</label><br>
                <input type="text" name="velocity" class="velocity-input">
                <br>
                <label for="angle">Starting Angle</label><br>
                <input type="text" name="angle" class="angle-input">
                <br>
                <label for="gravity">Acting Gravitation</label><br>
                <input type="text" name="gravity" class="gravity-input" value="9.8">
                <br>
                <p>This setting will calculate at which angle the projectile will land on point x.</p>
                <label for="impact">Impact at x meters</label><br>
                <input type="text" name="impact" class="impact-input">
                <br>
                <label for="stoke">Activate stoke' drag</label><br>
                <input type="checkbox" name="stoke" class="stoke-input" id="stoke">
                <br>
                <input type="submit" value="Start Simulation">

            </form>
        </fieldset>
    </div>
    <fieldset id="dataField">
        <legend>Data</legend>
        <div id="datalists">
        </div>
    </fieldset>
    <button onclick="newProjectile();">create new projectile</button>
    <button onclick="clearCanvas();">Reset Projectiles</button>
</body>

</html>