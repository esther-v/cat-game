const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = .00001
const worldEl = document.querySelector("[data-world]")
const groundElems = document.querySelectorAll("[data-ground]")

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

//update the game depending on time
function update(time) {
    if(lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    updateGround(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)

    lastTime = time
    window.requestAnimationFrame(update)
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
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

