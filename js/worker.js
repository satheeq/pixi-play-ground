self.addEventListener('message', async (event) => {
    if (event.data) {
        console.error('event data', event.data);

        const { width, height, resolution, view } = event.data;

        // The application will create a renderer using WebGL, if possible,
        // with a fallback to a canvas render. It will also setup the ticker
        // and the root stage PIXI.Container
        const app = new PIXI.Application({ width, height, background: '#1099bb', resolution, view });

        // load the texture we need
        const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');

        // This creates a texture from a 'bunny.png' image
        const bunny = new PIXI.Sprite(texture);

        // Setup the position of the bunny
        bunny.x = app.renderer.width / 2;
        bunny.y = app.renderer.height / 2;

        // Rotate around the center
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;

        // Add the bunny to the scene we are building
        app.stage.addChild(bunny);

        // Listen for frame updates
        app.ticker.add(() => {
            // each frame we spin the bunny around a bit
            bunny.rotation += 0.01;
        });

    }
});