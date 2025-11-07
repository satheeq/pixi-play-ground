function importDataAdapterScripts (params) {
    if (typeof params.filename === 'string' && params.filename.trim()) {
        self.importScripts(params.filename);
    }
}

async function sendChartRequest (params) {
    const data = await getChartData(params);

    return data;
}