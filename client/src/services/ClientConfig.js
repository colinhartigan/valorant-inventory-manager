const Config = {
    FRONTEND_VERSION: "1.0.0b2",
    SERVER_VERSION_COMPATABILITY: ["1.0.0b2"],
    VERSION_CHECK_ENABLED: true,

    WEBSOCKET_URL: "ws://localhost:8765", 
    SOCKET_RETRY_THRESHOLD: 5,

    WEIGHT_INTERVALS: 10,

    BYPASS_ONBOARDING: false,

    NAVIGATION_ENABLED: false,
    ENABLED_PAGES: {
        "collection": true,
        "buddies": false,
    }
}

var ServerVersion = "";

function setVersion(version) {
    ServerVersion = version;
}

export {Config, ServerVersion, setVersion}