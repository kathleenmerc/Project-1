// Canvas set up
const canvas = document.getElementById("myCanvas")
canvas.width = "800"
canvas.height = "600"
canvas.style.border = "1px solid black"
let ctx = canvas.getContext("2d")

// Buttons
const onePlayerBtn = document.getElementById("onePlayerBtn")
const twoPlayersBtn = document.getElementById("twoPlayersBtn")
const nextBtn = document.getElementById("nextBtn")
const playBtn = document.getElementById("playBtn")
const gameNextBtn = document.getElementById("gameNextBtn")
const playAgainBtn = document.getElementById("playAgainBtn")

// Obstacles
class Obstacle {
    constructor(x) {
        this.x = x
        this.y = Math.floor(Math.random() * ((canvas.height - 50) - 50) + 50) // logic: Math.floor(Math.random() * (max - min)) + min
        this.w = 50
        this.h = Math.floor(Math.random() * (200 - 50) + 50)
    }
}

let obstacle1 = new Obstacle(500)
let obstacle2 = new Obstacle(obstacle1.x + 500) // so each obstacle is 500px apart
let obstacle3 = new Obstacle(obstacle2.x + 500)


// Helicopters
class Helicopter {
    constructor(x, y, w, h) {
        this.x = 150 //coordinates of where on canvas img heli will start
        this.y = 300
        this.w = 106 //image width
        this.h = 49 //image height
        this.lives = 3
    }

    drawHeli(heliImage) {
        ctx.drawImage(heliImage, this.x, this.y)
    }

    updateHeli() {
        console.log("updating heli")
        //if (this.lives > 0) {
            this.x = 150 //coordinates of where on canvas img heli will start when updated
            this.y = 300
            this.w = 106 //image width
            this.h = 49 //image height
            this.lives-- // this will decrease 1 life 
            console.log(this.lives)
        //}
    }
}

let redHeli = new Helicopter
let blueHeli = new Helicopter

// Images
let redHeliImg = document.createElement("img")
redHeliImg.src = "images/red-heli.png"
let blueHeliImg = document.createElement("img")
blueHeliImg.src = "images/blue-heli.png"


// Global Variables
let state = "opening"
let mouseIsPressed = false
let mode;
let playerScore = 0
let winningScore;
let scoresArray = []
let saveHighScore = "highscore storage" // save highscore of local storage of high score
let highScore = localStorage.getItem(saveHighScore)





///// FUNCTIONS /////


// Draw function
window.addEventListener("load", draw) // the load event listener will call the draw() once the entire page is loaded

function draw() {
    //console.log("draw function test")

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



// Opening screen
function drawOpening() {
    //console.log("opening test")

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

    // Event Listeners
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
    //blueHeli.drawHeli(blueHeliImg)
}


// Settings screen
// function drawSettings() {
//     //console.log("settings test")

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
//     //blueHeli.drawHeli(blueHeliImg)
// }




// Instructions screen
function drawInstructions() {
    //console.log("instructions test")

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

    // Event listeners
    playBtn.addEventListener("click", () => {
        state = "draw game"
    })
}

// Draw game screen
function drawGame() {
    console.log("draw game test")

    // things still needed:
    // top left player 1 name

    // Background and Borders
    drawBorders()

    // Obstacles
    drawObstacles()

    // Text
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText("Click to Start Flying", 150, 580)

    // Buttons
    playBtn.classList.add("hidden")

    // Helicopter
    if (mode === "2players" && redHeli.lives === 0) {
        blueHeli.drawHeli(blueHeliImg)
    } else {
        redHeli.drawHeli(redHeliImg)
    }


    // Scores
    drawCurrentScore()
    increaseScore()
    drawHighScore()
    checkHighScore()
    checkWinningScore()

    //lives
    drawLives()

    // Game Event Listeners
    canvas.addEventListener("mousedown", mousedownHandler) // when mousedown is activated, state = runGame
    canvas.addEventListener("mouseup", mouseupHandler)

}



// Running the game
function runGame() {
    //console.log("run game test")
    gameNextBtn.classList.add("hidden")


    // Game logic
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

// Checking for collisions with the obstacles
function checkCollisionsObstacles(heliX, heliY, heliW, heliH, obstacleX, obstacleY, obstacleW, obstacleH) {
    if (heliX < (obstacleX + obstacleW) && (heliX + heliW) > obstacleX && heliY < (obstacleY + obstacleH) && (heliY + heliH) > obstacleY) {
        state = "crash"
    }
}






// crash state
function crash() {
    console.log("Crash test")

    drawCircle()
    updateObstacles()

    if (mode === "1player" || (mode === "2players" && redHeli.lives > 0)) {
        redHeli.updateHeli()
    } else { 
        blueHeli.updateHeli()
    }


    // push score from each round into scoresArray
    scoresArray.push(playerScore)
    console.log(scoresArray)

    state = "passive"
}

// Passive state
function passive() {
    console.log( "passive state")
    // Buttons
    gameNextBtn.classList.remove("hidden")

    // Event Listeners
    gameNextBtn.addEventListener("click", gameNextBtnHandler)
}


function gameNextBtnHandler() {
    if ((mode === "1player" && redHeli.lives === 0) || (mode === "2players" && redHeli.lives <= 0 && blueHeli.lives <= 0)) {
        state = "game over"
    } else {
        loop()
    }
}

// lopos back to "draw game" state, for next round
function loop() {
    playerScore = 0
    state = "draw game"

    // Event listeners
    canvas.addEventListener("mousedown", mousedownHandler)
    canvas.addEventListener("mouseup", mouseupHandler)
    //gameNextBtn.removeEventListener("click", gameNextBtnHandler)

    // Text
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText("Click to Start:", canvas.width / 2, 110)

    // Helicopter
    if (mode === "1player" || (mode === "2players" && redHeli.lives > 0)) {
        redHeli.drawHeli(redHeliImg)
    } else {
        blueHeli.drawHeli(blueHeliImg)
    }
}






    // Winner and Scores screen
    function drawGameOver() {
        console.log("game over test")

        // Remove Event listeners
        canvas.removeEventListener("mousedown", mousedownHandler)
        canvas.removeEventListener("mouseup", mouseupHandler)

        // Background and Borders
        drawBorders()

        // Buttons
        gameNextBtn.classList.add("hidden")
        playAgainBtn.classList.remove("hidden")

        playAgainBtn.addEventListener("click", () => {
            resetGame()
        })

        // Scores
        checkHighScore()
        drawHighScore()
        drawFinalScores()
        checkWinningScore()
        drawWinningScore()

        state = ""
    }






