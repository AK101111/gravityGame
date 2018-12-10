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
var goodToGo = false
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
var colors = ["rgb(255,255,0)", "rgb(255,215,0)", "rgb(255,165,0)", "rgb(255,140,0)", "rgb(255,69,0)", "rgb(0,0,0)"]
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// when a planet is hit, it will keep burning and be visible till certain period of time within a game. if player starts a new part game, the burning planet might still be visible for the player to see the location of the planet.
function drawPlanets()
{
    
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
        document.getElementById("p2ScoreSeeker").innerHTML =  player2.seekScore;
    else if(spaceship.numFirings <= 2 * numRounds)
        document.getElementById("p1ScoreHider").innerHTML = player1.hideScore;
    else if(spaceship.numFirings <= 3 * numRounds)
        document.getElementById("p1ScoreSeeker").innerHTML = player1.seekScore;
    else
        document.getElementById("p2ScoreHider").innerHTML = player2.hideScore;
}
function declareResults(){
    if(player1.hideScore + player1.seekScore > player2.hideScore + player2.seekScore)
        alert('The game has ended. Player 1 won.');
    else if(player1.hideScore + player1.seekScore < player2.hideScore + player2.seekScore)
        alert('The game has ended. Player 2 won.');
    else
        alert('The game has ended. Game drawn.');
}
function statusUpdate(){
    document.getElementById("roundNumber").innerHTML = "Round:" + ((spaceship.numFirings) % numRounds + 1).toString();
    if(spaceship.numFirings <= numRounds){
        document.getElementById("status1").innerHTML = "Player 1: Hider";
        document.getElementById("status2").innerHTML = "Player 2: Seeker";
        document.getElementById("status").innerHTML = "Spaceship Captain: Player 2";
    }
    else if(spaceship.numFirings <= 2 * numRounds){
        document.getElementById("status1").innerHTML = "Player 1: Hider";
        document.getElementById("status2").innerHTML = "Player 2: Seeker";
        document.getElementById("status").innerHTML = "Spaceship Captain:Player 1";
    }
    else if(spaceship.numFirings <= 3 * numRounds){
        document.getElementById("status1").innerHTML = "Player 1: Seeker";
        document.getElementById("status2").innerHTML = "Player 2: Hider";
        document.getElementById("status").innerHTML = "Spaceship Captain:Player 1";
    }
    else{
        document.getElementById("status1").innerHTML = "Player 1: Seeker";
        document.getElementById("status2").innerHTML = "Player 2: Hider";
        document.getElementById("status").innerHTML = "Spaceship Captain:Player 2";
    }
}
function resetPartGame(hitTarget){
    spaceship.timeSinceLastRun = -10000000;
    goodToGo = false;
    showResult();
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
    let found = true;
    if(spaceship.numFirings % numRounds == 0)
    {
        let x1 = Number(inputs.elements["p1x"].value);
        let y1 = Number(inputs.elements["p1y"].value);
        let x2 = Number(inputs.elements["p2x"].value);
        let y2 = Number(inputs.elements["p2y"].value);
        let m1 = Number(inputs.elements["p1m"].value);
        let m2 = totalPlanetMass - m1;
        spaceship.boostsRemaining = totalBoosts;
        document.getElementById("boosts").innerHTML = totalBoosts;
        if(x1 < 0 || x1 > canvas.width){
            found = false;
            alert("Wrong planet 1 X coordinate");
        }
        if(y1 < 0 || y1 > canvas.height){
            found = false;
            alert("Wrong planet 1 Y coordinate");
        }
        if(x2 < 0 || x2 > canvas.width){
            found = false;
            alert("Wrong planet 2 X coordinate");
        }
        if(y2 < 0 || y2 > canvas.height){
            found = false;
            alert("Wrong planet 2 Y coordinate");
        }
        if(m1 < 1 || m1 > totalPlanetMass - 1){
            found = false;
            alert("Wrong planet 1 mass");
        }
        if(found) {;
            planet1.position.x = x1;
            planet1.position.y = y1;
            planet2.position.x = x2;
            planet2.position.y = y2;
            planet1.mass = m1;
            planet2.mass = m2;
        }
    }
    let ang = Number(inputs.elements["ang"].value);
    if(ang < -90 || ang > 90){
        found = false;
        alert("Wrong angle");
    }
    if(found) {
        spaceship.angle = (Math.PI / 180) * ang;
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
    if(goodToGo == false)
    {
        goodToGo = init()
        if(goodToGo)
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
    if(goodToGo)
        requestAnimationFrame(draw);
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