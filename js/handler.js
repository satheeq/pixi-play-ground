function start() {
    function _createApp() {
        // Create the renderer
        const app = new PIXI.Application(
            {
                antialias: true,
                transparent: true,
                resolution: window.devicePixelRatio,
                preserveDrawingBuffer: true,
                roundPixels: false,
                autoDensity: true,
                width: 600,
                height: 600,
                backgroundColor: 0xCCCCCC
            });

        console.log('Device pixel ratio ' + window.devicePixelRatio);

        // renderer.view.style.position = 'relative'; // This is removing as a fix for the canvas dislocate issue need to be further test in all charts
        app.view.style.display = 'block';
        // renderer.view.style.height = '100%';
        // renderer.view.style.width = '100%';
        app.autoResize = true;

        PIXI.settings.RESOLUTION = window.devicePixelRatio;
        PIXI.settings.ROUND_PIXELS = false;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR; // NEAREST- Pixelating scaling; LINEAR - Smooth scaling

        // Setting up events
        app.stage.interactive = true;
        // app.stage.interactiveChildren = true;
        app.stage.hitArea = app.screen;

        const ticker = app.ticker;

        ticker.autoStart = false;
        ticker.stop();

        return app;
    }

    function onDragStart(event) {
        app.ticker.start();

        container.eventData = event.data;
        container.dragging = true;
        container.dx = event.data.x - container.x;

        console.log('onDragStart');
    }

    function onDragEnd() {
        delete container.eventData;
        container.dragging = false;
        // app.stage.off('pointermove', onDragMoveApp);

        app.ticker.stop();
        console.log('onDragEnd');
    }

    function onDragMove(event) {
        if (container.dragging) {
            console.log('onDragMove', event.x);
            container.x = event.x - container.dx;
        }
    }

    // Create the application helper and add its render target to the page
    // const app = new PIXI.Application({width: document.width, height: document.height});

    const app = _createApp();
    document.body.appendChild(app.view);

// Add a container
    const container = new PIXI.Container();
    container.x = 0;
    container.y = 0;
// container.interactiveChildren = true;

// app.stage.on('pointerdown', onDragStart);
// container.hitArea = app.screen;
// container.interactive = true;

    app.stage.on('pointerdown', onDragStart);
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);
    app.stage.on('pointermove', onDragMove);

    app.stage.addChild(container);

// Create window frame
    let candleGrp = new PIXI.Graphics();
    let lineGrp = new PIXI.Graphics();

    const data = getJSONData();
    console.error('data count', data.length);

    let x = app.stage.hitArea.width - 50,
        y = 0,
        candW = 10,
        candH = 30,
        point = null,
        bull = 0x05CE2E,
        bear = 0xE06666,
        color = bull;

    lineGrp.moveTo(x, data[0].open + 15);


    for (let i = 0; i < data.length; i++) {
        point = data[i];
        x = x - candW - 4;
        y = point.close;

        color = point.close < point.open ? bear : bull;

        candleGrp.beginFill(color);
        candleGrp.lineStyle({color: 0xFFFFFF, width: 1, alignment: 0});
        candH = (point.close - point.open) * 6;
        candleGrp.drawRect(x, y, candW, candH);
        candleGrp.moveTo(x, y);
        candleGrp.endFill();

        lineGrp.beginFill(0xFFF666);
        lineGrp.lineStyle({color: 0x6FA8DC, width: 2, alignment: 0});
        lineGrp.lineTo(x, point.open + 15);
    }

    lineGrp.closePath();
    lineGrp.endFill();

    container.addChild(candleGrp);
    container.addChild(lineGrp);

    setInterval(() => {
        if (!container.dragging) {
            app.ticker.update();
            app.renderer.render(app.stage);
        }
    }, 300);

}