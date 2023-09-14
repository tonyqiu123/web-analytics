// Initialize variables
var userInteracted = false;
var startTime = new Date().getTime();
var userCountry;
var userDevice;
var path = window.location.pathname;
var source = document.referrer || 'direct';
var uniqueVisit = source === '' ? true : sourceHostname !== window.location.hostname;
var sourceHostname = 'unknown';

if (source) {
    sourceHostname = new URL(source).hostname;
}

// Add an event listener for user interactions
document.addEventListener('click', function () {
    userInteracted = true;
});

// Add a beforeunload event listener to send analytics data
window.addEventListener('beforeunload', sendAnalyticsData);

// Fetch user's country
getUserCountry().then(country => {
    userCountry = country || 'unknown';
});

// Detect user's device type
userDevice = detectDeviceType();

async function sendAnalyticsData() {
    var endTime = new Date().getTime();
    var durationInSeconds = (endTime - startTime) / 1000;
    var isBounceVisit = !userInteracted;

    const requestData = {
        country: userCountry,
        device: userDevice,
        page: path || 'unknown',
        source: source,
        visitDuration: durationInSeconds,
        isBounceVisit: isBounceVisit,
        domain: window.location.hostname,
        isUniqueVisit: uniqueVisit
    };

    try {
        const apiUrl = 'https://web-analytics-production.up.railway.app/';
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
            keepalive: true
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getUserCountry() {
    try {
        const response = await fetch('https://ipinfo.io?token=2f9a4aeaf877be');
        const data = await response.json();
        return data.country;
    } catch (error) {
        console.error("Error fetching user's country:", error);
        return null;
    }
}

function detectDeviceType() {
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Mobile Safari|Mobile\ssafari|Silk|Kindle|Dolfin|Opera Mini|Opera Mobi|Fennec/i;
    const tabletRegex = /iPad|Tablet|Nexus|Amazon Kindle|Touch|PlayBook|Tablet\sOS|Silk|Kindle|KFOT|KFJWI|KFSOWI|KFTHWI|KFMAWI|KFTT|KFJWA|KFJWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFFOWI|KFMEWI|KFSAWA|KFTBWI/i;
    const tvRegex = /SmartTV|Television|TV/i;
    const gamingConsoleRegex = /PlayStation|Xbox|Nintendo/i;
    const wearableRegex = /Smartwatch|Wearable/i;
    const desktopRegex = /Windows|Macintosh|Linux|Ubuntu/i;

    if (mobileRegex.test(userAgent)) {
        return "Mobile";
    } else if (tabletRegex.test(userAgent)) {
        return "Tablet";
    } else if (tvRegex.test(userAgent)) {
        return "TV";
    } else if (gamingConsoleRegex.test(userAgent)) {
        return "Gaming Console";
    } else if (wearableRegex.test(userAgent)) {
        return "Wearable";
    } else if (desktopRegex.test(userAgent)) {
        return "Desktop";
    } else {
        return "Unknown";
    }
}



// this script tracks the following: user device type (mobile, desktop), time spent visitng site, user country, the current url path (/about, /contact). All data is collected anonymously and is compliant with the EU's strict GDPR data security standards.