// Background and Borders
function drawBorders() {
    // Background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Green borders
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, canvas.width, 50)
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50)
}

function drawObstacles() {
    ctx.fillRect(obstacle1.x, obstacle1.y, obstacle1.w, obstacle1.h)
    ctx.fillRect(obstacle2.x, obstacle2.y, obstacle2.w, obstacle2.h)
    ctx.fillRect(obstacle3.x, obstacle3.y, obstacle3.w, obstacle3.h)
}


function updateObstacles() {
    // Update x-coordinates
    obstacle1.x = 500
    obstacle2.x = obstacle1.x + 500 // so each obstacle is 500px apart
    obstacle3.x = obstacle2.x + 500

    // Update y-coordinates
    obstacle1.y = Math.floor(Math.random() * ((canvas.height - 50) - 50) + 50)
    obstacle2.y = Math.floor(Math.random() * ((canvas.height - 50) - 50) + 50)
    obstacle3.y = Math.floor(Math.random() * ((canvas.height - 50) - 50) + 50)

    // Update height
    obstacle1.h = Math.floor(Math.random() * (200 - 50) + 50)
    obstacle2.h = Math.floor(Math.random() * (200 - 50) + 50)
    obstacle3.h = Math.floor(Math.random() * (200 - 50) + 50)
}


function drawScore() {
    ctx.fillText(`player score: ${playerScore}`, 110, 100)
}

function increaseScore() {
    if (state === "run game") {
        playerScore++
    }
}

function drawLives() {
    ctx.font = "16px courier";
    ctx.fillStyle = "white";
    ctx.fillText(`Lives: ${redHeli.lives}`, 110, 150);
}



function mousedownHandler() {
    //console.log("mouse is down")
    mouseIsPressed = true
    if (state === "draw game") {
        //console.log(mouseIsPressed)
        state = "run game"
    }
}

function mouseupHandler() {
    //console.log("mouse is up")
    mouseIsPressed = false
}





// Moving the helicopter up and down
function controlHeli() {
    //console.log("control heli test")

    if (mouseIsPressed) {
        redHeli.y += -3 // remember in canvas (0,0) is top left corner so the greater the y value the lower on the canvas it is
    } else if (mouseIsPressed === false) {
        redHeli.y += 3
    }
}



function drawCircle() {
    // Circle around Helicopter
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(240, 270, 60, 0, 2 * Math.PI);
    ctx.stroke();
}


// Moving the obstacles
function moveObstacles() {
    // need to add increase speed with increased distance
    obstacle1.x += -3
    obstacle2.x += -3
    obstacle3.x += -3

    // Repeating the obstacles once they are off the screen
    // obstacle.x + obstacle.w < 0 to refer to the right side of each obstacle 
    // want each obstacle 500px apart
    if (obstacle1.x + obstacle1.w < 0) {
        obstacle1.x = obstacle3.x + 500
        obstacle1.y = Math.floor(Math.random() * (((canvas.height - 50) - 50) + 50)) // need to randomize this y value each time
    } else if (obstacle2.x + obstacle2.w < 0) {
        obstacle2.x = obstacle1.x + 500
        obstacle2.y = Math.floor(Math.random() * (((canvas.height - 50) - 50) + 50))
    } else if (obstacle3.x + obstacle3.w < 0) {
        obstacle3.x = obstacle2.x + 500
        obstacle3.y = Math.floor(Math.random() * (((canvas.height - 50) - 50) + 50))
    }
}


// Reset the game from the beginning
function resetGame () {
    // Reset Background and Borders
    drawBorders()

    // Reset Obstacles
    updateObstacles()
    drawObstacles()

    // Reset redHeli
    redHeli.updateHeli()
    redHeli.drawHeli(redHeliImg)

    // Buttons
    playAgainBtn.classList.add("hidden")

    // Reset global variables
    mouseIsPressed = false
    mode;
    playerScore = 0
    redHeli.lives = 3
    state = "opening"
}