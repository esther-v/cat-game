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

//update sapin
const SAPIN_INTERVAL_MIN = 500
const SAPIN_INTERVAL_MAX = 2000
let nextSapinTime

function setupSapin() {
    nextSapinTime = SAPIN_INTERVAL_MIN
    document.querySelectorAll("[data-sapin]").forEach(sapin => {
        sapin.remove()
    })
}

function updateSapin(delta, speedScale) {
    document.querySelectorAll("[data-sapin]").forEach(sapin => {
        incrementCustomProperty(sapin, "--left", delta * speedScale * SPEED * -1)
        if(getCustomProperty(sapin, "--left") <= -100) {
            sapin.remove()
        }
    })
    if (nextSapinTime <= 0) {
        createSapin()
        nextSapinTime = randomNumberBetween(SAPIN_INTERVAL_MIN, SAPIN_INTERVAL_MAX) / speedScale
    }
    nextSapinTime -= delta
}

function createSapin() {
    const sapin = document.createElement("img")
    sapin.dataset.sapin = true
    sapin.src = "img/sapin2.png"
    sapin.classList.add("sapin")
    sapin.style.height = '20%'
    setCustomProperty(sapin, "--left", 100)
    worldEl.append(sapin)
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//start the game
document.addEventListener("keydown", handleStart, {once: true})

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupCat() 
    setupSapin()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
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
    updateSapin(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)

    if(checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

//losing, check if the cat touch the tree

function getSapinRects() {
    return [...document.querySelectorAll("[data-sapin]")].map(sapin => {
        return sapin.getBoundingClientRect()
    })
}

function getCatRect() {
    return catElem.getBoundingClientRect()
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right && 
        rect1.top < rect2.bottom && 
        rect1.right > rect2.left && 
        rect1.bottom > rect2.top
    )
}

function checkLose() {
    const catRect = getCatRect()
    return getSapinRects().some(rect => isCollision(rect, catRect))
}

function setCatLose() {
    catElem.src = "img/cat-lose.png"
}

function handleLose() {
    setCatLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true})
        startScreenElem.classList.remove("hide")
    }, 100)
}