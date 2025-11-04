importScripts('./web-data-adapter.js');

async function sendChartRequest (params) {
    let data;

    switch (params.type) {
        case 'WEB':
            data = await sendMixChartRequest(params);
            break;
    }

    return data;
}