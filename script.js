const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = .00001
const worldEl = document.querySelector("[data-world]")
const groundElems = document.querySelectorAll("[data-ground]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")


let lastTime
let speedScale
let score

//resize the world depending on the screen size
function setPixelToWorldScale(){
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }
    worldEl.style.width = `${WORLD_WIDTH * worldToPixelScale}px` 
    worldEl.style.height = `${WORLD_HEIGHT * worldToPixelScale}px` 
}
setPixelToWorldScale()
window.addEventListener('resize', setPixelToWorldScale)

//start the game
document.addEventListener("keydown", handleStart, {once: true})

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupCat() 
    setupCactus()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

//update custom property
function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}

function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value)
}

function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)
}

//update the game, make the moves
function update(time) {
    if(lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    updateGround(delta, speedScale)
    updateCat(delta, speedScale)
    updateCactus(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)

    lastTime = time
    window.requestAnimationFrame(update)
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
    score += delta * 0.01 
    scoreElem.textContent = Math.floor(score)
}


//update ground
const SPEED = 0.05

function setupGround() {
    setCustomProperty(groundElems[0], "--left", 0)
    setCustomProperty(groundElems[1], "--left", 300)
}

function updateGround(delta, speedScale) {
    groundElems.forEach(ground => {
        incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1)

        if(getCustomProperty(ground, "--left") <= -300) {
            incrementCustomProperty(ground, "--left", 600)
        }
    })
}



//update cat moves
const catElem = document.querySelector('[data-cat]')
const JUMP_SPEED = .45
const GRAVITY = .0015
const CAT_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let catFrame
let currentFrameTime
let yVelocity

function setupCat(){
    isJumping = false
    catFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(catElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
}

function updateCat(delta, speedScale){
    handleRun(delta, speedScale)
    handleJump(delta)
}

function handleRun(delta, speedScale) {
    if(isJumping) {
        catElem.src = `img/cat-attack.png`
        return
    }

    if (currentFrameTime >= FRAME_TIME) {
        catFrame = (catFrame + 1) % CAT_FRAME_COUNT
        catElem.src = `img/cat-run-${catFrame}.png` 
        currentFrameTime -= FRAME_TIME   
    }
    currentFrameTime += delta * speedScale
}

function handleJump(delta) {
    if(!isJumping) return

    incrementCustomProperty(catElem, "--bottom", yVelocity * delta)
    
    if(getCustomProperty(catElem, "--bottom") <= 0) {
        setCustomProperty(catElem, "--bottom", 0)
        isJumping = false
    }

    yVelocity -= GRAVITY * delta
}

function  onJump(e) {
    if (e.code !== "Space" || isJumping) return

    yVelocity = JUMP_SPEED
    isJumping = true
}

//update cactus
const CACTUS_INTERVAL_MIN = 500
const CACTUS_INTERVAL_MAX = 2000
let nextCactusTime

function setupCactus() {
    nextCactusTime = CACTUS_INTERVAL_MIN
}

function updateCactus(delta, speedScale) {
    document.querySelectorAll("[data-cactus]").forEach(cactus => {
        incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1)
    })
    if (nextCactusTime <= 0) {
        createCactus()
        nextCactusTime = randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale
    }
    nextCactusTime -= delta
}

function createCactus() {
    const cactus = document.createElement("img")
    cactus.dataset.cactus = true
    cactus.src = "img/cactus.png"
    cactus.classList.add("cactus")
    setCustomProperty(cactus, "--left", 100)
    worldEl.append(cactus)
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

