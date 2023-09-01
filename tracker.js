(function (window) {
    // Configuration variables
    var apiUrl = 'https://your-tracking-server.com/collect'; // Replace with your tracking server URL
    var domain = window.location.hostname;

    function sendEvent(id, state) {
        let data = {
            "tracking_id": id,
            "domain": domain,
            "page": window.location.pathname,
            "state": state,
        };
        fetch(`${apiUrl}/event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            keepalive: true,
        })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function logState(state) {
        console.log(`WebPulse: page is ${state}`);
    }

    // Main tracking function
    function trackEvent() {
        var tracking_id = crypto.randomUUID();
        var state = document.visibilityState; // Initial state

        logState(state);
        sendEvent(tracking_id, state);

        document.addEventListener("visibilitychange", () => {
            let new_state = document.visibilityState;

            if (new_state !== state) {
                state = new_state;
                logState(state);
                sendEvent(tracking_id, state);
            }
        });
    }

    // Expose the trackEvent function globally
    window.trackEvent = trackEvent;
})(window);
