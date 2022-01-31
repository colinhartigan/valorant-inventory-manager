const Config = {
    FRONTEND_VERSION: "1.0.0b1",
    SERVER_VERSION_COMPATABILITY: ["1.0.0b1"],
    VERSION_CHECK_ENABLED: true,

    WEBSOCKET_URL: "ws://localhost:8765", 
    SOCKET_RETRY_THRESHOLD: 5,

    WEIGHT_INTERVALS: 10,

    BYPASS_ONBOARDING: false,
}

var ServerVersion = "";

function setVersion(version) {
    ServerVersion = version;
}

export {Config, ServerVersion, setVersion}