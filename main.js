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

// Images
let redHeliImg = document.createElement("img")
redHeliImg.src = "images/red-heli.png"


// Global Variables
let state = "opening" //"opening" // "settings" // "instructions" // "draw game" // "run game" // "scores"
let mouseIsPressed = false
let heli = {
    w: 106, //image width
    h: 49, //image height
    x: 150, //coordinates of where on canvas img heli will start
    y: 300,
}




///// FUNCTIONS /////


// Draw function
window.addEventListener("load", draw) // the load event listener will call the draw() once the entire page is loaded

function draw() {
    console.log("draw function test")

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
    } else if (state === "scores") {
        drawScores()
    }

    // Request Animation Frame - From MDN (The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint.)
    requestAnimationFrame(draw)
}




// Opening screen
function drawOpening() {
    console.log("opening test")

    // Background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Green borders
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, canvas.width, 50)
    ctx.fillRect(0, 550, canvas.width, 50) // used 550 bc canvas height is 600 minus 50

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
        state = "settings"
        //draw()
    })

    twoPlayersBtn.addEventListener("click", () => {
        state = "settings"
    })

    // Helicopter
        ctx.drawImage(redHeliImg, heli.x, heli.y)
}



// Settings screen
function drawSettings() {
    console.log("settings test")

    // things still needed:
    // Player 1 and 2 Names, input boxes
    // Player 1 and 2 heli color

    // Background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Green borders
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, canvas.width, 50)
    ctx.fillRect(0, 550, canvas.width, 50) // used 550 bc canvas height minus 50

    // Buttons
    onePlayerBtn.classList.add("hidden")
    twoPlayersBtn.classList.add("hidden")
    nextBtn.classList.remove("hidden")

    // Event listeners
    nextBtn.addEventListener("click", () => {
        state = "instructions"
    })

    // Helicopter
    ctx.drawImage(redHeliImg, heli.x, heli.y)

}




// Instructions screen
function drawInstructions() {
    console.log("instructions test")

    // Background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Green borders
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, canvas.width, 50)
    ctx.fillRect(0, 550, canvas.width, 50) // used 550 bc canvas height minus 50

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
    // top right lives left
    // bottom left distance


    // Background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Green borders
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, canvas.width, 50)
    ctx.fillRect(0, 550, canvas.width, 50) // used 550 bc canvas height minus 50

    // Text
    ctx.fillStyle = "white"
    ctx.font = "20px Courier"
    ctx.textAlign = "center"
    ctx.fillText("Click to Start:", canvas.width / 2, 110)

    // Buttons
    playBtn.classList.add("hidden")

    // Helicopter image
    ctx.drawImage(redHeliImg, heli.x, heli.y)
}


// Event Listeners to change state to "run game" to start the game and move the helicopter
document.addEventListener("mousedown", mousedownHandler)
document.addEventListener("mouseup", mouseupHandler)

function mousedownHandler() {
    mouseIsPressed = true
    if (state === "draw game") {
        console.log(mouseIsPressed)
        state = "run game"
    }
}

function mouseupHandler() {
    mouseIsPressed = false
}


// Running the game
function runGame() {
    console.log("run game test")

    // heli movement logic
    controlHeli()

    // call drawGame() for visuals
    drawGame()
}


// Moving the helicopter up and down
function controlHeli() {
    console.log("control heli test")
    // things still needed:
    // logic for mouse down = heli goes up
    // logic for mouse release = heli goes down
    // logic for collision, red circle when crash
    // Event listeners for controlling the helicopter

    if (mouseIsPressed) {
        heli.y += -3
    } else if (mouseIsPressed === false) {
        heli.y += 3
    }
}














// use a loop between player 1 and player 2 
// do while loop? for 3 lives each

// Winner and Scores screen
function drawScores() {
    console.log("scores test")
    // player 1 list of scores 
    // player 2 list of scores
    // Player x wins with score (highest score)
    // Play again button - to reset to opening screen
}




//draw()