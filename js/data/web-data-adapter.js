importScripts('./utils/mix-request-generator.js');

async function getChartData (params) {
    const {exg, sym} = params.data;
    const url = generateChartMixRequest(exg, sym, { isDailyBased: true });
    // const authorization = 'eyJ0eXAiOiJKV1QiLCJraWQiOiJwdWJsaWNfa2V5X3Byb2Rfc2F1ZGkudHh0IiwiYWxnIjoiUlM1MTIifQ.eyJyZXMiOnsiMjIiOiI1RkRDM0M5NS03NTY2LTQ1QjgtOEYwMC1ERjQ2MzUzMERDREYiLCIzMCI6IjEiLCIyMCI6Ik5JUFVOIiwiMzUiOjEzODkxOCwiMzIiOiIgIiwiMTIwIjoxLCIxMTMiOiJJU0kiLCIzNiI6IjIwMjUxMjMxIiwiMzgiOjU4LCIzOSI6IlNZUywxMzd8VERXTCwyMTI3LDEyN3xHTE9CQUwsMCwxNCIsIjI4IjoiTlRQX0FVVEgiLCIxMTkiOiJNVUJBU0hFUixwcm8ubXViYXNoZXIubmV0IiwiMTE0IjoiNzguOTMuMjMwLjc5IiwiMTE2IjoiNzguOTMuMjMwLjc5IiwiMTE4IjoiNzguOTMuMjMwLjc5IiwiMTE1IjoiRU58QVJ8RlJ8UlV8VFJ8VVIiLCIxMjgiOiI3OC45My4yMzAuNzkiLCIxMjUiOjIsIjEyNyI6Ik5vdCBleGlzdHMgaW52YWxpZCBleGNoYW5nZXMuLi4iLCIzMyI6IlREV0wsMSxULFNBLDc4LjkzLjIzMC4xMDAsOTAwNiw3OC45My4yMzAuMTAwLDkwMDUsMCwxLCx8R0xPQkFMLDAsQVcsVVMsNzguOTMuMjMwLjEwMCw5MDA2LDc4LjkzLjIzMC4xMDAsOTAwNSwwLDEsLCIsIjM0IjoiU1lTLDUsNiw3LDgsMTAsMTIsMTMsMTYsMTcsMTksMjEsMjcsMjksMzksNDcsNDgsNDksNTAsNTEsNTIsNTMsNTYsNTksNjQsNjUsNjYsNjcsNjgsNjksNzAsNzIsNzUsMTEyLDIxMywyMjF8VERXTCwzOCwxMzUsMTMyLDEsMiwzLDExLDE0LDIwLDIyLDIzLDI4LDQxLDQyLDQ1LDQ2LDYwLDYxLDYyLDYzLDc0LDExNiwxMjksMzAwIiwiNDAiOjEsIjIzOSI6Ik1UTXlmREV5T1h3eE16VT0iLCIyNDAiOiJURFdMfDF-Mn4zfjZ-NyJ9LCJ1bm0iOiJOSVBVTiIsInJlcSI6eyIxNTAiOiIxMCIsIjI2IjoiRU4iLCIyNCI6IjcxIiwiMjMiOiJERk5QUk8xMl9TQV9SRVRBSUxfWF8xLjAyMy4wMC4wLjEyOCJ9LCJpYXQiOjE3NjIxNTM5NDcsImV4cCI6MTc2MjE2MTE0NywiaXNzIjoiTlRQX0FVVEgifQ.BzapA-VZKqM5m8TbLeN0RRv8sRse9qTZhQ5zTEecrSUQNC1vy9xR1eE2hUhJhaFrWouPmzuhWU0ZeeRo_fLQdWZ2ZpkFbQZnAf3KVG1PXBz7ivIfYWGbXkITmTLpIRgvBS1qc4TOP3gtZodZDLwMYEncPPIxLNdTu9LyHM8kzBqnUO1l0WezPo7gOVwXIrQpI2anGbchyhXBpdxMQg1s5Jk24DzVGyze7YtRD8vrpGNfAEHTe44KVxtASe4aH1HWKBo2LtBBnw5Jv8zlFhEB3XDC-vNWLVWfzbjYD7Nqn2xRcUeOdq9TCbHlWpJmrj8P7KNAtcdI-7pfR0D2au3-lg';

    console.log('send the chart request', url);

    try {
        const response = await fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': authorization
            }
        });

        return  await response.json();
    } catch (error) {
        console.error(`Error while fetching MIX intraday data for ${exg}-${sym}: ${error}`);
        throw error;
    }
}

// async function auth (params = {}) {
//     const URL = 'https://dfn-authenticator.directfn.sa/auth';
//
//     const AuthResponse = await fetch (URL ,
//         {
//             method: 'POST',
//             body: JSON.stringify({
//                 "authVersion": "10",
//                 "userVersion": "DFNPRO12_SA_RETAIL_X_1.023.00.0.128",
//                 "productType": 71,
//                 "language": "EN",
//                 "metaVersion": 0,
//                 "username": params.USERNAME, // NIPUN
//                 "password": params.PASSWORD // "123456789"
//             })
//         }
//
//     )
// }