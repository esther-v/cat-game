const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const worldEl = document.querySelector("[data-world]")
const groundElems = document.querySelectorAll("[data-ground]")

//resize the world depending on the screen size
setPixelToWorldScale()
window.addEventListener('resize', setPixelToWorldScale)

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

//update depending on the time
let lastTime

function update(time) {
    if(lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime

    updateGround(delta)

    lastTime = time
    window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)

//update ground
function updateGround(delta) {
    groundElems.forEach(ground => {

    })
}

//update custom property
function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}

function setCustomProperty() {

}

function incrementCustomProperty() {

}