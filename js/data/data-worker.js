importScripts('./data-manager.js');
importScripts('./history-data-store.js');
importScripts('./intraday-data-store.js');

self.addEventListener('message',  async function (event) {
    try {
        const {msgType, params} = event.data;

        switch (msgType) {
            case 'INIT':
                importDataAdapterScripts(params);
                break;

            case 'FETCH_DATA':
                // Check in DS and if not send a request
                let data = await  sendChartRequest(event.data.params);
                self.postMessage({ msgType: 'RECEIVE_DATA', message: 'data from the worker', data });

                break;

        }
    } catch (error) {
        postMessage({ error: error.message });
    }
});
