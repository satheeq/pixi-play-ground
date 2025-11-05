function importDataAdapterScripts (params) {
    switch (params.type) {
        case 'WEB':
            self.importScripts('./web-data-adapter.js');
            break;

        case 'MOBILE':
            self.importScripts('./mobile-data-adapter.js');
            break;

        case 'SOCKET':
            self.importScripts('./socket-data-adapter.js');
            break;
    }
}

async function sendChartRequest (params) {
    const data = await getChartData(params);

    return data;
}