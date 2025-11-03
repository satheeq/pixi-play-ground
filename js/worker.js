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

let textPool = [
    new PIXI.Text('', textStyle),
    new PIXI.Text('', textStyle),
    new PIXI.Text('', textStyle),
];


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
                const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');

                // This creates a texture from a 'bunny.png' image
                bunny = new PIXI.Sprite(texture);

                // Setup the position of the bunny
                bunny.x = app.renderer.width / 2;
                bunny.y = app.renderer.height / 2;

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
                switch (data.eventType) {
                    case 'click':
                        console.info('CLICK: ', data.point);

                        textPool[0].text = `You clicked: `;
                        textPool[1].text = `X: ${data.point.x}\rY: ${data.point.y}`;

                        textPool[0].position.set(data.point.x, data.point.y);
                        textPool[1].position.set(data.point.x, data.point.y + 20);

                        app.stage.addChild(textPool[0]);
                        app.stage.addChild(textPool[1]);

                        setTimeout(() => {
                            app.stage.removeChild(textPool[0]);
                            app.stage.removeChild(textPool[1]);
                        }, 2000);
                        break
                    case 'mousemove':
                        textPool[2].text = `X: ${data.point.x}/ Y: ${data.point.y}`;

                        textPool[2].position.set(10, 10);

                        app.stage.addChild(textPool[2]);
                        break;

                    case 'mousedown':
                        console.info('MOUSE_DOWN: ', data.point);
                        break;

                    case 'mouseup':
                        console.info('MOUSE_UP: ', data.point);
                        break
                }
                break;

            default:
        }



    }


});
