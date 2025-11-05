importScripts('./data-manager.js');
importScripts('./history-data-store.js');
importScripts('./intraday-data-store.js');

let drawingWorkerPort;

self.addEventListener('message',  function (event) {
    try {
        const {msgType, params, port} = event.data;

        switch (msgType) {
            case 'INIT':
                drawingWorkerPort = port;

                drawingWorkerPort.onmessage = function (event) {
                    handleOSCWorkerEvents(event);
                };
                drawingWorkerPort.start();

                importDataAdapterScripts(params);
                break;

        }
    } catch (error) {
        postMessage({ error: error.message });
    }
});

async function handleOSCWorkerEvents (event) {
    switch (event.data.msgType) {
        case 'FETCH_DATA':
            // Check in DS and if not send a request
            let data = await  sendChartRequest(event.data.params);
            drawingWorkerPort.postMessage({ msgType: 'RECEIVE_DATA', message: 'data from the worker', data });

            break;
    }
}