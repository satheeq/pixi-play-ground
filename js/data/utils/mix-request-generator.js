function generateChartMixRequest (exg, sym, args = {}) {
    let reqUrlPrefix = `https://data-sa9.mubasher.net/mix2/ClientServiceProvider`;

    const queryParams = {
        RT: 37,
        UID: '123',
        SID: 'sid',
        UNC: 1,
        UE: exg,
        H: 1,
        M: 1,
        E: exg,
        S: sym,
        AE: 1,
        CM: args.isDailyBased ? 3 : 2, // History: 3, Intraday: 2
        CT: 8,
        SO: 'DESC'
    };

    let url;
    const queryArray = [];

    for (const prop in queryParams) {
        if (Object.prototype.hasOwnProperty.call(queryParams, prop)) {
            const encoded = encodeURIComponent(queryParams[prop]);
            queryArray[queryArray.length] = [prop, encoded].join('=');
        }
    }

    url = queryArray.join('&');
    url = [reqUrlPrefix, url].join('?');

    return url;
}