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


function drawCurrentScore() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText(`Score: ${playerScore}`, 110, 30)
}

function drawHighScore() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText(`High score: ${highScore}`, 650, 30)
}

function drawFinalScores() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText("Player 1:", canvas.width / 2, 90)
    ctx.fillText(`Round 1: ${scoresArray[0]}`, canvas.width / 2, 110)
    ctx.fillText(`Round 2: ${scoresArray[1]}`, canvas.width / 2, 130)
    ctx.fillText(`Round 3: ${scoresArray[2]}`, canvas.width / 2, 150)
}



function drawWinningScore() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText(`Winning score: ${winningScore}`, canvas.width / 2, 170)
}

function increaseScore() {
    if (state === "run game") {
        playerScore++
    }
}

function drawLives() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    if (mode === "1player" || (mode === "2players" && redHeli.lives > 0)){
        ctx.fillText(`Lives: ${redHeli.lives}`, canvas.width / 2, 30);
    } else {
        ctx.fillText(`Lives: ${blueHeli.lives}`, canvas.width / 2, 30);
    }
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

    if (mode === "1player" || (mode === "2players" && redHeli.lives > 0)) {
        if (mouseIsPressed) {
            redHeli.y += -3 // remember in canvas (0,0) is top left corner so the greater the y value the lower on the canvas it is
        } else {
            redHeli.y += 3
        }
    } else {
        if (mouseIsPressed) {
            blueHeli.y += -3
        } else { 
            blueHeli.y += 3
        }
    }
}



function drawCircle() {
    // Circle around Helicopter

    if (mode === "2players" && redHeli.lives === 0) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 5;
        ctx.beginPath()
        ctx.arc(blueHeli.x + blueHeli.w / 2, blueHeli.y + blueHeli.h / 2 , 60, 0, 2 * Math.PI)
        ctx.stroke();
    } else {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.beginPath()
        ctx.arc(redHeli.x + redHeli.w / 2, redHeli.y + redHeli.h / 2 , 60, 0, 2 * Math.PI)
        ctx.stroke();
    }
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
    blueHeli.updateHeli()

    // Buttons
    playAgainBtn.classList.add("hidden")

    // Reset global variables
    mouseIsPressed = false
    mode;
    playerScore = 0
    redHeli.lives = 3
    scoresArray = []
    state = "opening"
}



function checkWinningScore() {
    winningScore = Math.max(...scoresArray) // this will find highest number in scoresArray
}



function checkHighScore() {
    if (playerScore >= highScore) {
        highScore = playerScore
        localStorage.setItem(saveHighScore, highScore) // this will add new highScore to local storage
    }
}


// Checking for collisions
function checkCollisionsBorders() {
    if (mode === "1player" || (mode === "2players" && redHeli.lives > 0)) {
        if ((redHeli.y < 50) || (redHeli.y + redHeli.h > canvas.height - 50)) {
            state = "crash"
        }
    } else if (mode === "2players" && redHeli.lives === 0) {
        if ((blueHeli.y < 50) || (blueHeli.y + blueHeli.h > canvas.height - 50)) {
            state = "crash"
        }
    }
}