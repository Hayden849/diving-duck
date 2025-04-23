enum SpriteKind {
    Player,
    Gap
}

let mySprite: Sprite = null
let topPipe: Sprite = null
let bottomPipe: Sprite = null
let gapSprite: Sprite = null

info.setScore(0)
scene.setBackgroundImage(assets.image`Night Sky`)
effects.clouds.startScreenEffect()

mySprite = sprites.create(assets.image`Duck0`, SpriteKind.Player)
mySprite.setPosition(30, 60)
mySprite.ay = 300 // Gravity
mySprite.startEffect(effects.trail, 500)

controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    mySprite.vy = -120 // Jump effect
    music.pewPew.play()
})

// Overlap with pipes = game over
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function () {
    game.over(false, effects.dissolve)
})

// Pass through the gap = gain a point
sprites.onOverlap(SpriteKind.Player, SpriteKind.Gap, function (player, gap) {
    info.changeScoreBy(1)
    gap.destroy() // Avoid multiple overlaps
})

// Make new pipe + gap every 1.5 seconds
game.onUpdateInterval(1500, function () {
    let gapHeight = 30
    let gapY = randint(30, scene.screenHeight() - 30 - gapHeight)

    // Top pipe
    topPipe = sprites.createProjectileFromSide(assets.image`hanging pipe 2`, -45, 0)
    topPipe.top = 0
    topPipe.left = scene.screenWidth()
    topPipe.setKind(SpriteKind.Projectile)

    // Bottom pipe
    bottomPipe = sprites.createProjectileFromSide(assets.image`Pipe top0`, -45, 0)
    bottomPipe.bottom = scene.screenHeight()
    bottomPipe.left = scene.screenWidth()
    bottomPipe.setKind(SpriteKind.Projectile)

    // Invisible gap sprite for scoring
    gapSprite = sprites.create(image.create(4, gapHeight), SpriteKind.Gap)
    gapSprite.setFlag(SpriteFlag.Invisible, true)
    gapSprite.left = scene.screenWidth()
    gapSprite.vx = -45
    gapSprite.y = gapY + gapHeight / 2
    gapSprite.setFlag(SpriteFlag.AutoDestroy, true)
})

// End game if player hits top or bottom of screen
game.onUpdate(function () {
    if (mySprite.top < 0 || mySprite.bottom > scene.screenHeight()) {
        game.over(false, effects.melt)
    }
})
