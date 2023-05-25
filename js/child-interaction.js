let app;
let baseContainer;
let isDragging = false;
let line;

function _createApp() {
    console.log('PIXI Version', PIXI.VERSION);
    // Get the container
    const htmlContainer = document.getElementById('chartContainer');

    // Create the renderer
    app = new PIXI.Application({
        antialias: true,
        transparent: true,
        resolution: window.devicePixelRatio,
        preserveDrawingBuffer: true,
        roundPixels: false,
        autoDensity: true,
        resizeTo: htmlContainer,
        backgroundColor: 0xCCCCCC,
        sharedTicker: false,
        autoStart: false
    });

    console.log('Device pixel ratio ' + window.devicePixelRatio);

    app.view.style.display = 'block';
    app.autoResize = true;

    PIXI.settings.RESOLUTION = window.devicePixelRatio;
    PIXI.settings.ROUND_PIXELS = false;
    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR; // NEAREST- Pixelating scaling; LINEAR - Smooth scaling
    PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.LINEAR;

    // Setting up events
    // app.stage.interactive = true; // This is depreciated in 7.2
    app.stage.eventMode = 'static'; // Used above 7.2

    // app.stage.interactiveChildren = true;
    app.stage.hitArea = app.screen;

    const ticker = app.ticker;

    ticker.stop();
    PIXI.Ticker.system.stop(); // System ticker usage 7.2 & Above

    // Register events
    console.log('registering events');

    app.stage.on('pointerdown', onDragStart);
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);
    app.stage.on('pointermove', onDragMove);

    // app.stage.on('pointerenter', () => {
    //     console.log('pointerEnter');
    // });
    // app.stage.on('pointerleave', () => {
    //     console.log('pointerLeave');
    // });

    // Create the application helper and add its render target to the page
    htmlContainer.appendChild(app.view);
}

function onDragStart(event) {
    app.ticker.start(); // Start the ticker for a smooth update

    isDragging = true;
    baseContainer.dx = event.data.x - baseContainer.x;

    console.log('onDragStart');
}

function onDragEnd(e) {
    if (isDragging) {
        isDragging = false;

        app.ticker.stop(); // Stop the ticker once drag finises
        console.log('onDragEnd');
    }
    e.currentTarget.cursor = 'auto';
}

function onDragMove(e) {
    if (isDragging) {
        baseContainer.x = e.x - baseContainer.dx;
    } else if (line.dragging) {
        e.currentTarget.cursor = 'move';
        let distanceX = e.global.x - line.startX;
        let distanceY = e.global.y - line.startY;

        line.x = line.rectStartX + distanceX;
        line.y = line.rectStartY + distanceY;
    }
}

function _initChart(container) {
    // Create window frame
    let candleGrp = new PIXI.Graphics();
    let lineGrp = new PIXI.Graphics();

    const data = getJSONData();
    console.info('data count', data.length);

    let x = app.stage.hitArea.width - 50,
        y = 0,
        candW = 10,
        candH = 30,
        point = null,
        bull = 0x05CE2E,
        bear = 0xE06666,
        color = bull;

    lineGrp.moveTo(x, data[0].open + 15);


    for (let i = 0; i < 100; i++) {
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



    app.ticker.update(performance.now());
    app.renderer.render(app.stage);

}

function _createContainer() {
    baseContainer = new PIXI.Container();
    app.stage.addChild(baseContainer);
}

function _addLine() {
    line = new PIXI.Graphics();
    let white = 0XFFFFFF;
    let hitPoints = [];
    let width = 1;

    const p1 = {x: 50, y: 50};
    const p2 = {x: 300, y: 300};
    const angle = Math.atan2(p1.y - p2.y, p1.x - p2.x);

    line.lineStyle(width, white, 1);
    line.moveTo(p1.x, p1.y);
    line.lineTo(p2.x, p2.y);

    // line.beginFill(0x0000ff);
    // line.lineStyle(1, 0x000000);
    // line.drawRect(50, 50, 100, 100);
    // line.endFill();

    hitPoints.push(p1.x - width / 2 * Math.sin(angle));
    hitPoints.push(p1.y + width / 2 * Math.cos(angle));
    hitPoints.push(p2.x - width / 2 * Math.sin(angle));
    hitPoints.push(p2.y + width / 2 * Math.cos(angle));
    hitPoints.push(p2.x + width / 2 * Math.sin(angle));
    hitPoints.push(p2.y - width / 2 * Math.cos(angle));
    hitPoints.push(p1.x + width / 2 * Math.sin(angle));
    hitPoints.push(p1.y - width / 2 * Math.cos(angle));

    line.hitArea = new PIXI.Polygon(hitPoints);

    line.eventMode = 'static';

    line.on('pointerdown', (e) => {
        app.ticker.start();

        line.dragging = true;
        line.startX = e.global.x;
        line.startY = e.global.y;

        line.rectStartX = line.x;
        line.rectStartY = line.y;

        e.stopPropagation(); // important
    });

    // line.on('pointermove', (e) => {
    //     if (line.dragging) {
    //         let distanceX = e.global.x - line.startX;
    //         let distanceY = e.global.y - line.startY;
    //
    //         line.x = line.rectStartX + distanceX;
    //         line.y = line.rectStartY + distanceY;
    //
    //         e.stopPropagation();
    //     }
    // });

    line.on('pointerup', (e) => {
        line.dragging = false;
        app.ticker.stop();
    });

    line.on('pointerupoutside', (e) => {
        line.dragging = false;
        app.ticker.stop();
    });

    line.on('pointerover', (event) => {
        event.currentTarget.cursor = 'move';
    });

    line.on('pointerout', (event) => {
        if (!line.dragging) {
            event.currentTarget.cursor = 'auto';
        }
    });

    baseContainer.addChild(line);
}


function start() {
    _createApp();
    _createContainer();
    _initChart(baseContainer);
    _addLine();

    // Re-render based on a timer
    // When dragging happens, ticker enabled to update without timer
    setInterval(() => {
        if (!isDragging) {
            app.ticker.update(performance.now());
            app.renderer.render(app.stage);
        }
    }, 300);
}