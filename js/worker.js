importScripts('../lib/pixi-worker-lib.js'); // Import Web Worker support PIXI library

let app;
let bunny;
let bunnyRotation = 0.02;
let textStyle = new PIXI.TextStyle({
    fontFamily: 'Cairo, sans-serif',
    fontSize: 14,
    fill: '#11224E',
    fontStyle: 'normal',
    fontWeight: 'bold',
    strokeThickness: 0
});
let textTimeout = undefined;

let textPool = [
    new PIXI.Text('', textStyle),
    new PIXI.Text('', textStyle),
    new PIXI.Text('', textStyle),
];

let isDragging = false;
let activePointer = undefined;
let dragTarget = undefined;
let dragOffset = {x: 0, y: 0};

self.addEventListener('message', async (event) => {
    if (event.data) {
        const { msgType, data } = event.data;

        switch (msgType) {
            case 'INIT':
                const { width, height, resolution, view } = data;

                // The application will create a renderer using WebGL, if possible,
                // with a fallback to a canvas render. It will also setup the ticker
                // and the root stage PIXI.Container
                app = new PIXI.Application({ width, height, background: '#1099bb', resolution, view });

                // load the texture we need
                const texture = await PIXI.Assets.load('../img/bunny.png');

                // This creates a texture from a 'bunny.png' image
                bunny = new PIXI.Sprite(texture);

                // Setup the position of the bunny
                bunny.x = width / 2;
                bunny.y = height / 2;

                // Rotate around the center
                bunny.anchor.x = 0.5;
                bunny.anchor.y = 0.5;

                // Add the bunny to the scene we are building
                app.stage.addChild(bunny);

                // Listen for frame updates
                app.ticker.add((deltaTime) => {
                    // each frame we spin the bunny around a bit
                    bunny.rotation += bunnyRotation;
                });
                break;

            case 'ACTION':
                switch (data.actionType) {
                    case 'speedPlus':
                        bunnyRotation += data.value;
                        app.ticker.stop();

                        app.ticker.add((deltaTime) => {
                            // each frame we spin the bunny around a bit
                            bunny.rotation += bunnyRotation;
                        });

                        app.ticker.start();

                        break
                    case 'speedMinus':
                        bunnyRotation -= data.value;
                        break;
                }
                break;

            case 'EVENT':
                const x = data.point.x;
                const y = data.point.y;
                const pointerId = data.pointerId;

                switch (data.eventType) {
                    case 'down':
                        isDragging = true;

                        if (isPointOnSprite(x, y, bunny)) {
                            activePointer = pointerId;
                            dragTarget = bunny;
                            dragOffset.x = bunny.x - x;
                            dragOffset.y = bunny.y - y;
                        }

                        console.info('## POINTER_DOWN: ', data.point);
                        break;

                    case 'move':
                        textPool[2].text = `X: ${x}/ Y: ${y}`;
                        textPool[2].position.set(10, 10);

                        app.stage.addChild(textPool[2]);

                        if (isDragging && pointerId === activePointer) {
                            dragTarget.x = x + dragOffset.x;
                            dragTarget.y = y + dragOffset.y;
                        }

                        break;
                    case 'up':
                        isDragging = false;
                        dragTarget = undefined;
                        activePointer = undefined;

                        console.info('## POINTER_UP: ', data.point);

                        clearTimeout(textTimeout);

                        if (!isPointOnSprite(x, y, bunny)) {
                            textPool[0].text = `You Pointed: `;
                            textPool[1].text = `X: ${x}\rY: ${y}`;

                            textPool[0].position.set(x, y);
                            textPool[1].position.set(x, y + 20);

                            app.stage.addChild(textPool[0]);
                            app.stage.addChild(textPool[1]);

                            textTimeout = setTimeout(() => {
                                app.stage.removeChild(textPool[0]);
                                app.stage.removeChild(textPool[1]);
                            }, 2000);
                        }

                        break
                }
                break;

            default:
        }



    }


});

function isPointOnSprite (x, y, sprite) {
    const local = sprite.toLocal({x, y});
    const w = sprite.width, h = sprite.height;

    if (local.x >= -w * sprite.anchor.x &&
        local.x <=  w * (1 - sprite.anchor.x) &&
        local.y >= -h * sprite.anchor.y &&
        local.y <=  h * (1 - sprite.anchor.y)) {

        // Pointer is inside the sprite
        console.info('## isPointOnSprite: YES ##');
        return true;
    }
}