async function getChartData (params) {
    const {exg, sym} = params.data;
    const userId = 'NIPUN';
    const socket = new WebSocket('ws://localhost:45333'); // pro12 eletron port

    socket.onopen = () => {
        console.log('Connected to Node WebSocket server');
        // Send message to call function on Node.js server
        socket.send(JSON.stringify(["calculator-data",{"requestObj":{"groupId":3},"type":1,"beginDate":"20251008","dataLevel":3,"interval":60,"wkey":"gl-4-1-1","exg":exg,"sym":sym,"userId":userId
        }]));

    }; //["calculator-data",{"requestObj":{"groupId":7},"wkey":"gl-4-1-1","exg":"TDWL","sym":"1010","userId":"NIPUN"}]

    socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
    };

    socket.onclose = () => {
        console.log('Disconnected from server');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}