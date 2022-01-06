const Config = {
    VERSION: "0.1.0b1",

    WEBSOCKET_URL: "ws://71.179.88.140:8765", 
    SOCKET_RETRY_THRESHOLD: 5,

    WEIGHT_INTERVALS: 10,

}

var ServerVersion = "";

function setVersion(version) {
    ServerVersion = version;
}

export {Config, ServerVersion, setVersion}