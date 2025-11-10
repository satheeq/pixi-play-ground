let app;
let baseContainer;
let isDragging = false;
let webWorkerInstance;
let drawingWorker;
let dataWorker;
let drawingCanvas;
let actionCanvas;

function _createApp() {
    console.log('PIXI Version', PIXI.VERSION);
    // Get the container
    const htmlContainer = document.getElementById('chartContainer');

    // Create the renderer
    app = new PIXI.Application({
        antialias: true,
        transparent: true,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio,
        preserveDrawingBuffer: true,
        roundPixels: false,
        autoDensity: true,
        resizeTo: htmlContainer,
        backgroundColor: 0x000000,
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

    app.stage.interactiveChildren = true;
    app.stage.hitArea = app.screen;

    const ticker = app.ticker;

    ticker.stop();
    PIXI.Ticker.system.stop(); // System ticker usage 7.2 & Above

    // Register events
    // console.log('registering events');
    //
    // app.stage.on('pointerdown', onDragStart);
    // app.stage.on('pointerup', () => {
    //     console.log('pointerUp');
    //     onDragEnd();
    // });
    // app.stage.on('pointerupoutside', () => {
    //     console.log('pointerupOutside');
    //     onDragEnd();
    // });
    // app.stage.on('pointermove', onDragMove);

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

function onDragEnd() {
    if (isDragging) {
        isDragging = false;

        app.ticker.stop(); // Stop the ticker once drag finises
        console.log('onDragEnd');
    }
}

function onDragMove(event) {
    if (isDragging) {
        baseContainer.x = event.x - baseContainer.dx;
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

function _createWebWorker() {
    console.log('Creating web worker (pixi imported)');

    const canvasContainer = document.getElementById('chartContainer');
    const controllerContainer = document.getElementById('controllerContainer');

    const width = document.body.clientWidth,
        height = document.body.clientHeight - (controllerContainer.clientHeight); // 10px Margin and 16px body margin
    const resolution = window.devicePixelRatio;

    drawingCanvas = document.getElementById('baseCanvas'); // Drawing Panel
    actionCanvas = document.getElementById('overlayCanvas'); // Interaction Panel

    drawingCanvas.style.width = `${width}px`;
    drawingCanvas.style.height = `${height}px`;

    actionCanvas.width = width * resolution;
    actionCanvas.height = height * resolution;
    actionCanvas.style.width = `${width}px`;
    actionCanvas.style.height = `${height}px`;

    canvasContainer.appendChild(actionCanvas);
    canvasContainer.appendChild(drawingCanvas);

    // Transfer canvas control to the worker
    const view = drawingCanvas.transferControlToOffscreen();

    // Create the worker
    webWorkerInstance = new Worker('./js/worker.js');
    // dataWorker = new Worker('./js/data/data-worker.js');

    const channel = new MessageChannel();

    webWorkerInstance.addEventListener('message', (event) => {
        if (event.data.success) {
            console.error(event.data.data.length);
        } else {
            console.error('Error:', event.data.error);
        }
    });

    // dataWorker.addEventListener('message', (event) => {
    //     if (event.data) {
    //         console.log(event.data.data);
    //     } else {
    //         console.error('Error:', event.data.error);
    //     }
    // });

   // dataWorker.postMessage({msgType: 'INIT', params: {type: 'WEB'}, port : channel.port2}, [channel.port2]);
    webWorkerInstance.postMessage({msgType: 'INIT', data: { width, height, resolution, view }}, [view]);
}

function _subscribeBtnActions () {
    // Button Events subscribe
    document.getElementById('speedPlus').addEventListener('click', () => {
        console.info('Speed (+) Clicked...');
        webWorkerInstance.postMessage({msgType: 'ACTION', data:{ actionType: 'speedPlus', value: 0.02 }});
    });

    document.getElementById('speedMinus').addEventListener('click', () => {
        console.info('Speed (-) Clicked...');
        webWorkerInstance.postMessage({msgType: 'ACTION', data:{ actionType: 'speedMinus', value: 0.02 }});
    });
}

function _subscribeCanvasEvents () {
    let lastSent = 0;

    const onPointerMove = (e) => {
        const now = performance.now();

        if (now - lastSent > 16) { // ~60fps
            lastSent = now;

            const rect = actionCanvas.getBoundingClientRect(); // position of canvas in page
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            webWorkerInstance.postMessage({msgType: 'EVENT', data: {
                eventType: 'move',
                pointerId: e.pointerId,
                pointerType: e.pointerType,
                point: {x, y, dx: e.movementX, dy: e.movementY}
            }});
        }
    };

    const onPointerEvent = (e, type) => {
        const rect = actionCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        webWorkerInstance.postMessage({msgType: 'EVENT', data: {
            eventType: type,
            pointerId: e.pointerId,
            pointerType: e.pointerType,
            point: {x, y, dx: e.movementX, dy: e.movementY},
        }});
    };

    actionCanvas.addEventListener('pointermove', (e) => {
        onPointerMove(e);
    });

    actionCanvas.addEventListener('pointerdown', (e) => {
        onPointerEvent(e, 'down');
    });

    actionCanvas.addEventListener('pointerup', (e) => {
        onPointerEvent(e, 'up');
        actionCanvas.releasePointerCapture(e.pointerId);
    });

    actionCanvas.addEventListener('pointercancel', (e) => {
        onPointerEvent(e, 'up');
        actionCanvas.releasePointerCapture(e.pointerId);
    });
}

function _sendChartRequest () {
    drawingWorker.postMessage({msgType: 'DRAW'});
}

function start() {
    // _createApp();
    _createWebWorker();
    _subscribeBtnActions();
    _subscribeCanvasEvents();
    _sendChartRequest();
    // _createContainer();
    // _initChart(baseContainer);

    // Re-render based on a timer
    // When dragging happens, ticker enabled to update without timer
    // setInterval(() => {
    //     if (!isDragging) {
    //         app.ticker.update(performance.now());
    //         app.renderer.render(app.stage);
    //     }
    // }, 300);
}