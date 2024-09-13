self.addEventListener('message', async (event) => {
    if (event.data) {
        console.error('event data', event.data);
        self.postMessage({ success: true, data: event.data });
    }
});