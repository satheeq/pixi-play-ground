function start () {
    var renderer = PIXI.autoDetectRenderer(800, 600);
    document.body.appendChild(renderer.view);

// create the root of the scene graph
    var stage = new PIXI.Container();

// create a texture from an image path
    var candleShape = PIXI.Texture.fromImage('_assets/candle.png');

    for (var i = 0; i < 10; i++) {
        createCandle(100*(i/2), 300));
    }
}

function createCandle(x, y) {
    // create our little candle friend..
    var candle = new PIXI.Sprite(texture);

    // enable the candle to be interactive... this will allow it to respond to mouse and touch events
    candle.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the candle with your mouse
    candle.buttonMode = true;

    // center the candle's anchor point
    candle.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    candle.scale.set(3);

    // setup events
    candle
        // events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    // move the sprite to its designated position
    candle.position.x = x;
    candle.position.y = y;

    // add it to the stage
    stage.addChild(candle);
}

requestAnimationFrame(animate);

function animate() {

    requestAnimationFrame(animate);

    // render the stage
    renderer.render(stage);
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}