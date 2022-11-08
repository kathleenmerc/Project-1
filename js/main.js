//////////----- VARIABLES -----//////////


// Canvas set up:

const canvas = document.getElementById("myCanvas")
canvas.width = "800"
canvas.height = "600"
canvas.style.border = "1px solid black"
let ctx = canvas.getContext("2d")



// Buttons:

const onePlayerBtn = document.getElementById("onePlayerBtn")
const twoPlayersBtn = document.getElementById("twoPlayersBtn")
const nextBtn = document.getElementById("nextBtn")
const playBtn = document.getElementById("playBtn")
const gameNextBtn = document.getElementById("gameNextBtn")
const playAgainBtn = document.getElementById("playAgainBtn")



// Global Variables:

let state = "opening"
let mouseIsPressed = false
let mode;
let playerScore = 0
let distanceBetweenObstacles = 500
let winningScore;
let scoresArray = []
let saveHighScore = "highscore storage" // variable in local storage where new highscore is saved
let highScore = localStorage.getItem(saveHighScore)



// Obstacle Class:

class Obstacle {
    constructor(x) {
        this.x = x
        this.y = Math.floor(Math.random() * ((canvas.height - 50) - 50) + 50) // logic: Math.floor(Math.random() * (max - min)) + min
        this.w = 50
        this.h = Math.floor(Math.random() * (200 - 50) + 50)
    }
}

let obstacle1 = new Obstacle(distanceBetweenObstacles)
let obstacle2 = new Obstacle(obstacle1.x + distanceBetweenObstacles) 
let obstacle3 = new Obstacle(obstacle2.x + distanceBetweenObstacles)



// Helicopter Class:

class Helicopter {
    constructor(x, y, w, h) {
        this.x = 150 // coordinates of where on canvas img heli will start
        this.y = 300
        this.w = 106 // image width
        this.h = 49 // image height
        this.lives = 3
    }

    drawHeli(heliImage) {
        ctx.drawImage(heliImage, this.x, this.y)
    }

    updateHeli() {
        //console.log("updating heli")
        this.x = 150 // coordinates of where on canvas img heli will start when updated
        this.y = 300
        this.w = 106 // image width
        this.h = 49 // image height
        this.lives-- // this will decrease 1 life 
        //console.log(this.lives)
    }
}

let redHeli = new Helicopter
let blueHeli = new Helicopter



// Images:

let redHeliImg = document.createElement("img")
redHeliImg.src = "images/red-heli.png"
let blueHeliImg = document.createElement("img")
blueHeliImg.src = "images/blue-heli.png"










//////////----- GAME STATE FUNCTIONS -----//////////



// Draw function:

function draw() {
    // console.log("draw function test")

    if (state === "opening") {
        drawOpening()
    } else if (state === "settings") {
        drawSettings()
    } else if (state === "instructions") {
        drawInstructions()
    } else if (state === "draw game") {
        drawGame()
    } else if (state === "run game") {
        runGame()
    } else if (state === "crash") {
        crash()
    } else if (state === "passive") {
        passive()
    } else if (state === "game over") {
        drawGameOver()
    }

    // Request Animation Frame - From MDN (The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint.)
    requestAnimationFrame(draw)
}



// Opening state:

function drawOpening() {
    // console.log("opening test")

    // Background and Borders
    drawBorders()

    // Obstacles
    drawObstacles()

    // Text
    ctx.fillStyle = "white"
    ctx.font = "40px Courier"
    ctx.textAlign = "center"
    ctx.fillText("The Helicopter Game", canvas.width / 2, canvas.height / 4)

    // Buttons
    onePlayerBtn.classList.remove("hidden")
    twoPlayersBtn.classList.remove("hidden")

    // Button Event Listeners
    onePlayerBtn.addEventListener("click", () => {
        mode = "1player"
        state = "instructions"
    })

    twoPlayersBtn.addEventListener("click", () => {
        mode = "2players"
        state = "instructions"
    })

    // Helicopter
    redHeli.drawHeli(redHeliImg)
    // blueHeli.drawHeli(blueHeliImg)
}



// *** Did not use Settings state code ***
// Settings state:
// function drawSettings() {
//     // console.log("settings test")

//     // things still needed:
//     // Player 1 and 2 Names, input boxes
//     // Player 1 and 2 heli color

//     // Background and Borders
//     drawBorders()

//     // Buttons
//     onePlayerBtn.classList.add("hidden")
//     twoPlayersBtn.classList.add("hidden")
//     nextBtn.classList.remove("hidden")

//     // Event listeners
//     nextBtn.addEventListener("click", () => {
//         state = "instructions"
//     })

//     // Helicopter
//     redHeli.drawHeli(redHeliImg)
//     // blueHeli.drawHeli(blueHeliImg)
// }



// Instructions state:

function drawInstructions() {
    // console.log("instructions test")

    // Background and Borders
    drawBorders()

    // Buttons
    onePlayerBtn.classList.add("hidden")
    twoPlayersBtn.classList.add("hidden")
    nextBtn.classList.remove("hidden")

    // Text
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText("Objective:", canvas.width / 2, 110)
    ctx.fillText("Fly your helicopter and avoid the obstacles.", canvas.width / 2, 150)
    ctx.fillText("Each player has 3 lives.", canvas.width / 2, 180)
    ctx.fillText("The player with the highest score wins.", canvas.width / 2, 210)
    ctx.fillText("How To Play:", canvas.width / 2, 300)
    ctx.fillText("Click and hold the left mouse button to go up.", canvas.width / 2, 330)
    ctx.fillText("Release to go down.", canvas.width / 2, 360)

    // Buttons
    nextBtn.classList.add("hidden")
    playBtn.classList.remove("hidden")

    // Button Event Listeners
    playBtn.addEventListener("click", () => {
        state = "draw game"
    })
}



// Draw game state:

function drawGame() {
    // console.log("draw game test")

    // Background and Borders
    drawBorders()

    // Obstacles
    drawObstacles()

    // Text
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText("Click to Start Flying", 150, 580)
    drawPlayerName()

    // Buttons
    playBtn.classList.add("hidden")

    // Helicopter
    drawLives()

    if (mode === "2players" && redHeli.lives === 0) {
        blueHeli.drawHeli(blueHeliImg)
    } else {
        redHeli.drawHeli(redHeliImg)
    }

    // Scores
    increaseScore()
    drawCurrentScore()
    checkHighScore()
    drawHighScore()
    checkWinningScore()

    // Game Event Listeners
    canvas.addEventListener("mousedown", mousedownHandler) // when mousedown is activated, state = runGame
    canvas.addEventListener("mouseup", mouseupHandler)
}



// Run game state:

function runGame() {
    // console.log("run game test")

    // Buttons
    gameNextBtn.classList.add("hidden")

    // Game Logic
    controlHeli()
    moveObstacles()
    checkCollisionsBorders()

    if ((mode === "1player") || (mode === "2players" && redHeli.lives > 0)) {
        checkCollisionsObstacles(redHeli.x, redHeli.y, redHeli.w, redHeli.h, obstacle1.x, obstacle1.y, obstacle1.w, obstacle1.h)
        checkCollisionsObstacles(redHeli.x, redHeli.y, redHeli.w, redHeli.h, obstacle2.x, obstacle2.y, obstacle2.w, obstacle2.h)
        checkCollisionsObstacles(redHeli.x, redHeli.y, redHeli.w, redHeli.h, obstacle3.x, obstacle3.y, obstacle3.w, obstacle3.h)
    } else {
        checkCollisionsObstacles(blueHeli.x, blueHeli.y, blueHeli.w, blueHeli.h, obstacle1.x, obstacle1.y, obstacle1.w, obstacle1.h)
        checkCollisionsObstacles(blueHeli.x, blueHeli.y, blueHeli.w, blueHeli.h, obstacle2.x, obstacle2.y, obstacle2.w, obstacle2.h)
        checkCollisionsObstacles(blueHeli.x, blueHeli.y, blueHeli.w, blueHeli.h, obstacle3.x, obstacle3.y, obstacle3.w, obstacle3.h)
    }

    // Call drawGame() for visuals
    drawGame()
}



// Crash state:

function crash() {
    // console.log("Crash test")

    // Helicopter
    drawCircle()
    if (mode === "1player" || (mode === "2players" && redHeli.lives > 0)) {
        redHeli.updateHeli()
    } else { 
        blueHeli.updateHeli()
    }

    // Obstacles
    updateObstacles()

    // Scores 
    scoresArray.push(playerScore) // push score from each round into scoresArray
    //console.log(scoresArray)

    state = "passive"
}



// Passive state:

function passive() {
    // console.log( "passive state test")

    // Buttons
    gameNextBtn.classList.remove("hidden")

    // Button Event Listeners
    gameNextBtn.addEventListener("click", gameNextBtnHandler)
}



// Gameover state:

function drawGameOver() {
    // console.log("game over test")

    state = ""

    // Remove Event listeners
    canvas.removeEventListener("mousedown", mousedownHandler)
    canvas.removeEventListener("mouseup", mouseupHandler)

    // Background and Borders
    drawBorders()

    // Scores
    checkHighScore()
    drawHighScore()
    checkWinningScore()
    drawFinalScores()

    // Buttons
    gameNextBtn.classList.add("hidden")
    playAgainBtn.classList.remove("hidden")

    // Button Event Listener
    playAgainBtn.addEventListener("click", () => {
        resetGame()
    })
}






//////////----- HELPER FUNCTIONS -----//////////


// Background and Borders:

function drawBorders() {
    // Background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Green borders
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, canvas.width, 50)
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50)
}



// Obstacles:

function drawObstacles() {
    ctx.fillRect(obstacle1.x, obstacle1.y, obstacle1.w, obstacle1.h)
    ctx.fillRect(obstacle2.x, obstacle2.y, obstacle2.w, obstacle2.h)
    ctx.fillRect(obstacle3.x, obstacle3.y, obstacle3.w, obstacle3.h)
}


function updateObstacles() {
    // Reset distance between obstacles
    distanceBetweenObstacles = 500 // starting with each obstacle 500px apart

    // Update x-coordinates
    obstacle1.x = distanceBetweenObstacles
    obstacle2.x = obstacle1.x + distanceBetweenObstacles 
    obstacle3.x = obstacle2.x + distanceBetweenObstacles

    // Update y-coordinates
    obstacle1.y = Math.floor(Math.random() * ((canvas.height - 50) - 50) + 50)
    obstacle2.y = Math.floor(Math.random() * ((canvas.height - 50) - 50) + 50)
    obstacle3.y = Math.floor(Math.random() * ((canvas.height - 50) - 50) + 50)

    // Update height
    obstacle1.h = Math.floor(Math.random() * (200 - 50) + 50)
    obstacle2.h = Math.floor(Math.random() * (200 - 50) + 50)
    obstacle3.h = Math.floor(Math.random() * (200 - 50) + 50)
}


function moveObstacles() {
    // obstacles will move 5px at a time to the left
    obstacle1.x += -5
    obstacle2.x += -5
    obstacle3.x += -5

    // obstacle movement will increase and distance between obstacles will decrease as the player's score increases
    if (playerScore % 100 === 0 && distanceBetweenObstacles <= 250) {
        distanceBetweenObstacles = 250
        obstacle1.x += -3
        obstacle2.x += -3
        obstacle3.x += -3
    }   else if (playerScore % 100 === 0) {
        // console.log("updating speed")
        distanceBetweenObstacles -= 10
        obstacle1.x += 3
        obstacle2.x += 3
        obstacle3.x += 3
        //console.log("distance between: " + distanceBetweenObstacles)
    }

    // Repeating the obstacles once they are off the screen
    // obstacle.x + obstacle.w < 0 to refer to the right side of each obstacle 
    if (obstacle1.x + obstacle1.w < 0) {
        obstacle1.x = obstacle3.x + distanceBetweenObstacles
        obstacle1.y = Math.floor(Math.random() * (((canvas.height - 50) - 50) + 50)) // need to randomize this y value each time
    } else if (obstacle2.x + obstacle2.w < 0) {
        obstacle2.x = obstacle1.x + distanceBetweenObstacles
        obstacle2.y = Math.floor(Math.random() * (((canvas.height - 50) - 50) + 50))
    } else if (obstacle3.x + obstacle3.w < 0) {
        obstacle3.x = obstacle2.x + distanceBetweenObstacles
        obstacle3.y = Math.floor(Math.random() * (((canvas.height - 50) - 50) + 50))
    }
}



// Collisions:

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


function checkCollisionsObstacles(heliX, heliY, heliW, heliH, obstacleX, obstacleY, obstacleW, obstacleH) {
    if (heliX < (obstacleX + obstacleW) && 
    (heliX + heliW) > obstacleX && 
    heliY < (obstacleY + obstacleH) && 
    (heliY + heliH) > obstacleY) {
        state = "crash"
    }
}



// Players and Lives:

function drawPlayerName() {
    if (mode === "2players" && redHeli.lives === 0) {
        ctx.textAlign = "center"
        ctx.fillText("Player 2", 110, 30)
    } else {
        ctx.textAlign = "center"
        ctx.fillText("Player 1", 110, 30)
    }
}


function drawLives() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    if (mode === "1player" || (mode === "2players" && redHeli.lives > 0)) {
        ctx.fillText(`Lives: ${redHeli.lives}`, canvas.width / 2, 30);
    } else {
        ctx.fillText(`Lives: ${blueHeli.lives}`, canvas.width / 2, 30);
    }
}



// Helicopter:

function controlHeli() {
    // console.log("control heli test")

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
        ctx.arc(blueHeli.x + blueHeli.w / 2, blueHeli.y + blueHeli.h / 2, 60, 0, 2 * Math.PI)
        ctx.stroke();
    } else {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.beginPath()
        ctx.arc(redHeli.x + redHeli.w / 2, redHeli.y + redHeli.h / 2, 60, 0, 2 * Math.PI)
        ctx.stroke();
    }
}



// Scores:

function drawCurrentScore() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText(`Score: ${playerScore}`, 650, 30)
}


function checkHighScore() {
    if (playerScore >= highScore) {
        highScore = playerScore
        localStorage.setItem(saveHighScore, highScore) // this will add new highScore to local storage
    }
}


function drawHighScore() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText(`High score: ${highScore}`, 650, 580)
}


function checkWinningScore() {
    winningScore = Math.max(...scoresArray) // this will find highest number in scoresArray
}


function drawFinalScores() {
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"

    if (mode === "1player") {
        ctx.fillText("Player 1:", canvas.width / 2, 90)
        ctx.fillText(`Round 1: ${scoresArray[0]}`, canvas.width / 2, 120)
        ctx.fillText(`Round 2: ${scoresArray[1]}`, canvas.width / 2, 140)
        ctx.fillText(`Round 3: ${scoresArray[2]}`, canvas.width / 2, 160)

        ctx.fillText(`Winning score: ${winningScore}`, canvas.width / 2, 210)

        if (winningScore >= highScore) {
            console.log("new high score test")
            ctx.fillStyle = "red"
            ctx.font = "20px Courier"
            ctx.textAlign = "center"
            ctx.fillText("*New High Score*", 650, 540)
        }
    } else {
        ctx.fillText("Player 1:", canvas.width / 2, 90)
        ctx.fillText(`Round 1: ${scoresArray[0]}`, canvas.width / 2, 120)
        ctx.fillText(`Round 2: ${scoresArray[1]}`, canvas.width / 2, 140)
        ctx.fillText(`Round 3: ${scoresArray[2]}`, canvas.width / 2, 160)

        ctx.fillText("Player 2:", canvas.width / 2, 200)
        ctx.fillText(`Round 1: ${scoresArray[3]}`, canvas.width / 2, 230)
        ctx.fillText(`Round 2: ${scoresArray[4]}`, canvas.width / 2, 250)
        ctx.fillText(`Round 3: ${scoresArray[5]}`, canvas.width / 2, 270)

        ctx.fillText(`Winning score: ${winningScore}`, canvas.width / 2, 330)
        twoPlayersWinner()

        if (winningScore >= highScore) {
            ctx.fillStyle = "red"
            ctx.font = "20px Courier"
            ctx.textAlign = "center"
            ctx.fillText("*New High Score*", 650, 540)
        }
    }
}


function twoPlayersWinner() {
    ctx.fillStyle = "white"
    ctx.font = "25px Courier"
    ctx.textAlign = "center"
    if (mode === "2players" && (winningScore === scoresArray[0] || winningScore === scoresArray[1] || winningScore === scoresArray[2])) {
        ctx.fillText("Player 1 wins!", canvas.width / 2, 360)
    } else {
        ctx.fillText("Player 2 wins!", canvas.width / 2, 360)
    }
}


function increaseScore() {
    if (state === "run game") {
        playerScore++
    }
}



// Loop function - loops back to the "draw game" state, for the player's next round:

function loop() {
    // console.log("looping test")

    playerScore = 0
    state = "draw game"

    // Game Event Listeners
    canvas.addEventListener("mousedown", mousedownHandler)
    canvas.addEventListener("mouseup", mouseupHandler)

    // Helicopter
    if (mode === "1player" || (mode === "2players" && redHeli.lives > 0)) {
        redHeli.drawHeli(redHeliImg)
    } else {
        blueHeli.drawHeli(blueHeliImg)
    }
}



// Reset the game from the beginning:

function resetGame() {
    // Reset Background and Borders
    drawBorders()

    // Reset Obstacles
    updateObstacles()
    drawObstacles()

    // Buttons
    playAgainBtn.classList.add("hidden")

    // Reset Heliopters
    redHeli.updateHeli()
    redHeli.drawHeli(redHeliImg)
    blueHeli.updateHeli()

    // Reset global variables
    mouseIsPressed = false
    mode;
    playerScore = 0
    redHeli.lives = 3
    blueHeli.lives = 3
    scoresArray = []
    state = "opening"
}






//////////----- EVENT LISTENERS -----//////////


// Loading the draw function:

window.addEventListener("load", draw) // the load event listener will call the draw() once the entire page is loaded



// Clicking gameNext button:

function gameNextBtnHandler() {
    if ((mode === "1player" && redHeli.lives === 0) || (mode === "2players" && redHeli.lives === 0 && blueHeli.lives === 0)) {
        state = "game over"
    } else {
        loop()
    }
}



// mousedown and mouseup to control helicopter:

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