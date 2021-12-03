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
    <h1>Projectile Visualiser</h1>
    <fieldset>
        <legend>Enter Projectile Data and Circumstances Data</legend>
        <form action="" onsubmit="createTrajectory(this); return false;">
            <label for="velocity">Starting Velocity</label>
            <input type="text" name="velocity" class="velocity-input">
            <br>
            <label for="angle">Starting Angle</label>
            <input type="text" name="angle" class="angle-input">
            <input type="submit" value="submit">
        </form>
    </fieldset>
    <canvas id="canvas"></canvas>
</body>
</html>