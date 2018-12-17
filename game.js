var timeStep = 0.15
var timeBetweenRuns = 0
var targetRadius = 10
var gravConst = 20
var spaceshipSpeed = 10
var planetRadius = 10
var gameRun = 0
var totalPlanetMass = 1000
var planet1Mass = Math.floor(Math.random() * totalPlanetMass)
var totalBoosts = 1
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var background = new Image();
var numRounds = 5
var goodToGo = 0
var planetNum = 0
background.src = "./photos/galaxy.png";
// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function(){
    context.drawImage(background,0,0);
}
var player1 =
{
    hideScore: 10000,
    seekScore: 10000
}
var player2 =
{
    hideScore: 10000,
    seekScore: 10000
}
var initPosition =
{
    x: Math.floor(Math.random() * (canvas.width - 2 * planetRadius) + planetRadius),
    y: canvas.height - planetRadius
}
var spaceship =
{
    color: "gray",
    width: 8,
    cylindricalHeight: 20,
    totalHeight: 40,

    position:
    {
        x: initPosition.x,
        y: initPosition.y
    },
    speed: spaceshipSpeed,
    angle: Math.random() * Math.PI - Math.PI / 2,
    velocity:
    {
        x: 0,
        y: 0
    },
    accelaration:
    {
    	x: 0,
    	y: 0
    },
    engineOn: true,
    fireLength: 10,
    boostFireLength: 40,
    boost: false,
    boostTime: 0,
    maxBoostTime: 40,
    boostsRemaining: totalBoosts,
    timeSinceLastRun: -10000000,
    numFirings: 0,
    crashed: false
}
var planet1 = {
    color: "blue",
    position:
    {
        x : Math.floor(Math.random() * (canvas.width - 2 * planetRadius) + planetRadius),
        y : Math.floor(Math.random() * (canvas.height - 2 * planetRadius) + planetRadius)
    },
    radius: planetRadius,
    mass : planet1Mass,
    onFire : false,
    timeSinceFire : 0
}
var planet2 = {
    color: "red",
    position:
    {
        x : Math.floor(Math.random() * (canvas.width - 2 * planetRadius) + planetRadius),
        y : Math.floor(Math.random() * (canvas.height - 2 * planetRadius) + planetRadius)
    },
    radius: planetRadius,
    mass : totalPlanetMass - planet1Mass,
    onFire : false,
    timeSinceFire : 0
}
var target = {
    innerColor: "red",
    outerColor: "white",
    position:
    {
        x: Math.floor(Math.random() * (canvas.width - 2 * planetRadius) + planetRadius),
        y: planetRadius
    },
    outerRadius: targetRadius,
    innerRadius: 4
}
function drawTarget()
{
    context.save();
    context.beginPath();
    context.arc(
        target.position.x,
        target.position.y,
        target.outerRadius,
        0, 2 * Math.PI);
    context.stroke();
    context.fillStyle = target.outerColor;
    context.fill();
    context.closePath()
    context.save();
    context.beginPath();
    context.arc(
        target.position.x,
        target.position.y,
        target.innerRadius,
        0, 2 * Math.PI);
    context.stroke();
    context.fillStyle = target.innerColor;
    context.fill();
    context.closePath();
    context.restore();
}
var planets = [ planet1, planet2]
var colors = ["rgb(255,255,0)", "rgb(255,215,0)", "rgb(255,165,0)", "rgb(255,140,0)", "rgb(255,69,0)"]
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// when a planet is hit, it will keep burning and be visible till certain period of time within a game. if player starts a new part game, the burning planet might still be visible for the player to see the location of the planet.

function erasePlanets(planetIndex)
{
        if(planetIndex == 1){
            var planet = planets[planetIndex];
            context.save();
            context.beginPath();
            context.arc(
            planet1.position.x,
            planet1.position.y,
            planet1.radius,
            0, 2 * Math.PI);
            context.stroke();
            context.fillStyle = "rgb(27,25,27)";
            context.fill();
            context.closePath();
            context.restore();
        }
       if(planetIndex == 2){
            var planet = planets[planetIndex];
            context.save();
            context.beginPath();
            context.arc(
            planet2.position.x,
            planet2.position.y,
            planet2.radius,
            0, 2 * Math.PI);
            context.stroke();
            context.fillStyle = "rgb(27,25,27)";
            context.fill();
            context.closePath();
            context.restore();
        }
}
function drawPlanets(planetIndex)
{
        if(planetIndex == undefined)
            planetIndex = 0;
        if(planetIndex == 1){
            var planet = planets[planetIndex];
            context.save();
            context.beginPath();
            context.arc(
            planet1.position.x,
            planet1.position.y,
            planet1.radius,
            0, 2 * Math.PI);
            context.stroke();
            context.fillStyle = "blue";
            context.fill();
            context.closePath();
            context.restore();
        }
       if(planetIndex == 2){
            var planet = planets[planetIndex];
            context.save();
            context.beginPath();
            context.arc(
            planet2.position.x,
            planet2.position.y,
            planet2.radius,
            0, 2 * Math.PI);
            context.stroke();
            context.fillStyle = "green";
            context.fill();
            context.closePath();
            context.restore();
        }
	for(index in planets){
        context.save();
        context.beginPath();
        var planet = planets[index];
        if(spaceship.numFirings > 15 || spaceship.numFirings > 5 && spaceship.numFirings <= 10){
            planet.timeSinceFire -= 1;
            context.arc(
            planet.position.x,
            planet.position.y,
            planet.radius,
            0, 2 * Math.PI);
            context.stroke();
            var indexC = getRandomInt(colors.length);
            context.fillStyle = colors[indexC];
            context.fill();
        }else{
	       //context.fillStyle = planet.color;
        }
        context.closePath();
        context.restore();
    }

}
function drawSpaceship()
{
    context.save();
    context.beginPath();
    context.translate(Math.floor(spaceship.position.x), Math.floor(spaceship.position.y));
    context.rotate(spaceship.angle);
    context.rect(spaceship.width * -0.5, spaceship.cylindricalHeight * -0.5, spaceship.width, spaceship.cylindricalHeight);
    context.fillStyle = spaceship.color;
    context.fill();
    context.closePath();
    context.save();
    context.beginPath();
    context.moveTo(spaceship.width * -0.5, spaceship.cylindricalHeight * -0.5);
    context.lineTo(spaceship.width * 0.5, spaceship.cylindricalHeight * -0.5);
    context.lineTo(0, spaceship.cylindricalHeight * 0.5 - spaceship.totalHeight);
    context.lineTo(spaceship.width * -0.5, spaceship.cylindricalHeight * -0.5);
    context.fillStyle = spaceship.color;
    context.fill();
    context.closePath();
    // Draw the flame if engine is on
    if(spaceship.engineOn)
    {
        context.save();
        context.beginPath();
        context.moveTo(spaceship.width * -0.5, spaceship.cylindricalHeight * 0.5);
        context.lineTo(spaceship.width * 0.5, spaceship.cylindricalHeight * 0.5);
        context.lineTo(0, spaceship.cylindricalHeight * 0.5 + Math.random() * spaceship.fireLength);
        context.lineTo(spaceship.width * -0.5, spaceship.cylindricalHeight * 0.5);
        context.fillStyle = "orange";
        context.fill();
        context.closePath();
    }
    if(++spaceship.boostTime > spaceship.maxBoostTime)
        spaceship.boost = false;
    if(spaceship.boost)
    {
        context.save();
        context.beginPath();
        context.moveTo(spaceship.width * -0.5, spaceship.cylindricalHeight * 0.5);
        context.lineTo(spaceship.width * 0.5, spaceship.cylindricalHeight * 0.5);
        context.lineTo(0, spaceship.cylindricalHeight * 0.5 + Math.random() * spaceship.boostFireLength);
        context.lineTo(spaceship.width * -0.5, spaceship.cylindricalHeight * 0.5);
        context.fillStyle = "red";
        context.fill();
        context.closePath();
    }
    context.restore();
    context.rotate(-spaceship.angle);
    context.translate(-Math.floor(spaceship.position.x), - Math.floor(spaceship.position.y));
}
function updateAccelaration()
{
	spaceship.accelaration.x = 0;
    spaceship.accelaration.y = 0;
    for(index in planets){
        var planet = planets[index];
        var dist = distance(spaceship.position, planet.position);
	    var acc = gravConst * planet.mass / (dist * dist);
	    var vec  = {
		  x: planet.position.x - spaceship.position.x,
		  y: planet.position.y - spaceship.position.y
	    }
	   var vmod = Math.hypot(vec.x, vec.y);
	   spaceship.accelaration.x += acc * vec.x / vmod;
	   spaceship.accelaration.y += acc * vec.y / vmod;
    }
}
function distance(pta, ptb)
{
	return Math.hypot(pta.x - ptb.x, pta.y - ptb.y);
}
function resetPosition(){
    spaceship.position.x = initPosition.x;
    spaceship.position.y = initPosition.y;
    spaceship.velocity.x = spaceship.speed * Math.sin(spaceship.angle);
    spaceship.velocity.y = -spaceship.speed * Math.cos(spaceship.angle);
}
// TODO: update scoreboard and stop the game if hit target(result == true)
// if this function is called the sixth time, stop the game without any effect
function showResult(){
    // display outcome
    // setString()
    // setScore()
    // stopGame();
    // wait for player to give velocity
    // update velocity
    if(spaceship.numFirings <= numRounds)
        document.getElementById("outputs").elements["p2ScoreSeeker"].value = player2.seekScore;
    else if(spaceship.numFirings <= 2 * numRounds)
        document.getElementById("outputs").elements["p1ScoreHider"].value = player1.hideScore;
    else if(spaceship.numFirings <= 3 * numRounds)
        document.getElementById("outputs").elements["p1ScoreSeeker"].value = player1.seekScore;
    else
        document.getElementById("outputs").elements["p2ScoreHider"].value = player2.hideScore;
}
function declareResults(){
    if(player1.hideScore + player1.seekScore > player2.hideScore + player2.seekScore){
        alert('The game has ended. Player 2 won.');
        
    }
    else if(player1.hideScore + player1.seekScore < player2.hideScore + player2.seekScore){
        alert('The game has ended. Player 1 won.');
        
    }else{
        alert('The game has ended. Game drawn.');
    }
}
function statusUpdate(){
    document.getElementById("statusF").elements["roundNumber"].value = ((spaceship.numFirings) % numRounds + 1);
    
    switch(spaceship.numFirings) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            document.getElementById("statusB").innerHTML = "Player 2 adjust angle, press submit";
            break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            document.getElementById("statusB").innerHTML = "Player 1 adjust angle, press submit";
            break;
        case 10:
            document.getElementById("statusB").innerHTML = "Player 2 place planets and press submit";
            break;
        case 11:
        case 12:
        case 13:
        case 14:
            document.getElementById("statusB").innerHTML = "Player 1 adjust angle, press submit";
            break;
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
            document.getElementById("statusB").innerHTML = "Player 2 adjust angle, press submit";
            break;   
    }

    
    if(spaceship.numFirings <= numRounds){
        document.getElementById("statusF").elements["status1"].value = "Hider";
        document.getElementById("statusF").elements["status2"].value = "Seeker";
        document.getElementById("statusF").elements["status"].value = "Player 2";
    }
    else if(spaceship.numFirings <= 2 * numRounds){
        document.getElementById("statusF").elements["status1"].value = "Hider";
        document.getElementById("statusF").elements["status2"].value = "Seeker";
        document.getElementById("statusF").elements["status"].value = "Player 1";
    }
    else if(spaceship.numFirings <= 3 * numRounds){
        document.getElementById("statusF").elements["status1"].value = "Seeker";
        document.getElementById("statusF").elements["status2"].value = "Hider";
        document.getElementById("statusF").elements["status"].value = "Player 1";
    }
    else{
        document.getElementById("statusF").elements["status1"].value = "Seeker";
        document.getElementById("statusF").elements["status2"].value = "Hider";
        document.getElementById("statusF").elements["status"].value = "Player 2";
    }
}
function resetPartGame(hitTarget){
    spaceship.timeSinceLastRun = -10000000;
    goodToGo = 0;
    showResult();
    inputs.elements["ang"].disabled = false;
    if(spaceship.numFirings % (2 * numRounds) == 0) {
        inputs.elements["p1x"].disabled = false;
        inputs.elements["p2x"].disabled = false;
        inputs.elements["p1y"].disabled = false;
        inputs.elements["p2y"].disabled = false;
        inputs.elements["p1m"].disabled = false;
    }
    if(hitTarget == true)
        spaceship.numFirings = Math.ceil(spaceship.numFirings / numRounds) * numRounds
    if(spaceship.numFirings == numRounds * 4){
        declareResults();
    }
    else{
        statusUpdate();
        resetPosition();
    }
}
function updateSpaceship()
{
    let targetDistance = distance(target.position, spaceship.position)
    if(spaceship.numFirings <= numRounds){
        if(player2.seekScore > targetDistance)
            player2.seekScore = targetDistance;
    }
    else if(spaceship.numFirings <= 2 * numRounds){
        if(player1.hideScore > targetDistance)
            player1.hideScore = targetDistance;
    }
    else if(spaceship.numFirings <= 3 * numRounds){
        if(player1.seekScore > targetDistance)
            player1.seekScore = targetDistance;
    }
    else{
        if(player2.hideScore > targetDistance)
            player2.hideScore = targetDistance;
    }
    if(spaceship.position.x == target.position.x && spaceship.position.y == target.position.y){
        resetPartGame(true);
    }
    if(++spaceship.timeSinceLastRun > timeBetweenRuns)
        resetPartGame(false);
	updateAccelaration();
    spaceship.velocity.x += timeStep * spaceship.accelaration.x;
    spaceship.velocity.y += timeStep * spaceship.accelaration.y;
    spaceship.position.x += timeStep * spaceship.velocity.x;
    spaceship.position.y += timeStep * spaceship.velocity.y;
    spaceship.angle = Math.atan2(spaceship.velocity.x, -spaceship.velocity.y)
    if(spaceship.position.x > canvas.width || spaceship.position.x < 0 || spaceship.position.y > canvas.height || spaceship.position.y < 0){
        if(spaceship.position.x < 9000)
            spaceship.timeSinceLastRun = 0;
        spaceship.position.x = 10000;
    }
    for(index in planets){
    	document.getElementById("inputs").elements["p2y"].value = planet2.position.y;
        var planet = planets[index];
        if(distance(planet.position, spaceship.position) <= planet.radius){
            if(spaceship.position.x < 9000)
                spaceship.timeSinceLastRun = 0;
            spaceship.position.x = 10000;
            //spaceship.crashed = true;
            planet.onFire = true;
            planet.timeSinceFire = 30;
            break;
        }
    }
}
function init(){
    inputs = document.getElementById("inputs");
    let found = 2;
    if(spaceship.numFirings % numRounds == 0 && spaceship.numFirings % (2 * numRounds) > 0){
        spaceship.boostsRemaining = totalBoosts;
        document.getElementById("boosts").innerHTML = totalBoosts;
    }
    if(spaceship.numFirings % (2 * numRounds) == 0 && goodToGo == 0)
    {
        planetNum = 0;
        let x1 = Number(inputs.elements["p1x"].value);
        let y1 = Number(inputs.elements["p1y"].value);
        let x2 = Number(inputs.elements["p2x"].value);
        let y2 = Number(inputs.elements["p2y"].value);
        let m1 = Number(inputs.elements["p1m"].value);
        let m2 = totalPlanetMass - m1;
        spaceship.boostsRemaining = totalBoosts;
        document.getElementById("boosts").innerHTML = totalBoosts;
        if(x1 < 0 || x1 > canvas.width){
            found = 0;
            alert("Wrong planet 1 X coordinate");
        }
        if(y1 < 0 || y1 > canvas.height){
            found = 0;
            alert("Wrong planet 1 Y coordinate");
        }
        if(x2 < 0 || x2 > canvas.width){
            found = 0;
            alert("Wrong planet 2 X coordinate");
        }
        if(y2 < 0 || y2 > canvas.height){
            found = 0;
            alert("Wrong planet 2 Y coordinate");
        }
        if(m1 < 1 || m1 > totalPlanetMass - 1){
            found = 0;
            alert("Wrong planet 1 mass");
        }
        if(found) {
            //planet1.position.x = x1;
            //planet1.position.y = y1;
            //planet2.position.x = x2;
            //planet2.position.y = y2;
            planet1.mass = m1;
            planet2.mass = m2;
            inputs.elements["p1x"].value = "";
            inputs.elements["p1x"].disabled = true;
            inputs.elements["p2x"].value = "";
            inputs.elements["p2x"].disabled = true;
            inputs.elements["p1y"].value = "";
            inputs.elements["p1y"].disabled = true;
            inputs.elements["p2y"].value = "";
            inputs.elements["p2y"].disabled = true;
            inputs.elements["p1m"].value = "";
            inputs.elements["p1m"].disabled = true;
            document.getElementById("statusB").innerHTML = "Player 2 adjust angle, press submit";
            return 1;
        }
    }
    let ang = Number(inputs.elements["ang"].value);
    if(isNaN(ang) || (ang < -90 || ang > 90)){
        found = 1;
        alert("Wrong angle");
    }
    if(found == 2) {
        inputs.elements["ang"].disabled = true;
        spaceship.angle = (Math.PI / 180) * ang;
        inputs.elements["ang"].value = "";
        spaceship.velocity.x = spaceship.speed * Math.sin(spaceship.angle);
        spaceship.velocity.y = -spaceship.speed * Math.cos(spaceship.angle);
        spaceship.numFirings++;
    }
    return found;
}
function drawBackground()
{
    context.drawImage(background,0,0);
    drawTarget();
    drawPlanets();
    drawSpaceship();
}
function start()
{
    if(goodToGo != 2)
    {
        goodToGo = init()
        if(goodToGo == 1){
            // clear screen
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(background,0,0);
            drawTarget();
            drawPlanets();
            drawSpaceship();
        }
        if(goodToGo == 2)
            draw();
    }
}
function draw()
{
    // Clear entire screen
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background,0,0);
    drawTarget();
    drawPlanets();
    updateSpaceship();
    // Begin drawing
    drawSpaceship();
    if(goodToGo){
        requestAnimationFrame(draw);
    }
}
function boost()
{
    if(spaceship.boostsRemaining > 0) {
        var speedBoost = 30;
        let speedIncreaseX = speedBoost * spaceship.velocity.x / Math.hypot(spaceship.velocity.x, spaceship.velocity.y);
        let speedIncreaseY = speedBoost * spaceship.velocity.y / Math.hypot(spaceship.velocity.x, spaceship.velocity.y);
        spaceship.velocity.x += speedIncreaseX;
        spaceship.velocity.y += speedIncreaseY;
        spaceship.boost = true;
        spaceship.boostTime = 0;
        document.getElementById("boosts").innerHTML = --spaceship.boostsRemaining;
    }
}
//document.addEventListener("click", assignPlanets, true);
function assignPlanets(event){
    if(spaceship.numFirings % (2 * numRounds) == 0  && goodToGo == 0){
        planetNum++;
        if(planetNum == 1){
    	    planet1.position.x = document.getElementById("inputs").elements["p1x"].value;
    	    planet1.position.y = document.getElementById("inputs").elements["p1y"].value;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(background,0,0);
            drawPlanets(1);
            drawTarget();
            drawSpaceship();
        }
        if(planetNum == 2){
     	    planet2.position.x = document.getElementById("inputs").elements["p2x"].value;
    	    planet2.position.y = document.getElementById("inputs").elements["p2y"].value;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(background,0,0);
            drawPlanets(1);
            drawPlanets(2);
            drawTarget();
            drawSpaceship();
        }
        //drawPlanets(planetNum);
    }
}
function setPlanets(event){
    if(goodToGo == 0 && spaceship.numFirings % (2 * numRounds) == 0){
    if(planetNum == 0){
    	document.getElementById("inputs").elements["p1x"].value = event.offsetX;
    	document.getElementById("inputs").elements["p1y"].value = event.offsetY;
        //drawPlanets(1);
    }
    if(planetNum == 1){
        document.getElementById("inputs").elements["p2x"].value = event.offsetX;
    	document.getElementById("inputs").elements["p2y"].value = event.offsetY;
     //   drawPlanets(2);
    }}
    //drawPlanets(planetNum);
}

function drawPlanetsUpdate(num){
    if(goodToGo == 0 && spaceship.numFirings % (2 * numRounds) == 0){
    if(num == 1){
        planet1.position.x = document.getElementById("inputs").elements["p1x"].value;
        planet1.position.y = document.getElementById("inputs").elements["p1y"].value;
    }
    if(num == 2){
        planet2.position.x = document.getElementById("inputs").elements["p2x"].value;
        planet2.position.y = document.getElementById("inputs").elements["p2y"].value;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background,0,0);
    drawPlanets(1);
    drawPlanets(2);
    drawTarget();
    drawSpaceship();
    }
}

function recalibSpaceship(nn){
    if(goodToGo <= 1){spaceship.angle = Math.PI/180 * Number(document.getElementById("inputs").elements["ang"].value);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background,0,0);
    drawTarget();
    drawSpaceship();
    }
}
