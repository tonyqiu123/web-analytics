// Intitialize variables
var userInteracted = false;  // check if user clicked
var startTime = new Date().getTime();
var userDevice = detectDeviceType()
var path = window.location.pathname;
var source = document.referrer; //which domain the user came from
var uniqueVisit = true
var sourceHostname = 'unknown';
var currentHostname = window.location.hostname;
var userCountry = 'unknown';

(async () => {
    userCountry = await getUserCountry();
    // convert 'https://brightbearsinfo.vercel.app/blog' to 'brightbearsinfo.vercel.app'
    if (source) {
        sourceHostname = new URL(source).hostname;
    }

    // check if domain of source equals domain of current website (eg. does 'brightbearsinfo.vercel.app' === 'discord.com')
    if (sourceHostname === currentHostname) {
        uniqueVisit = false
    }

    // if there is no source, then that means the user searched up the website's url directly.
    if (source === '') {
        source = 'direct'
    }

    // convert empty data to unknown
    if (!userCountry) {
        userCountry = 'unknown';
    }
    if (!userDevice) {
        userDevice = 'unknown';
    }
    if (!path) {
        path = 'unknown';
    }
})()


document.addEventListener('click', function () {
    userInteracted = true;
});


window.addEventListener('beforeunload', async function () {
    var endTime = new Date().getTime();
    var durationInSeconds = (endTime - startTime) / 1000;

    const requestData = {
        country: userCountry,
        device: userDevice,
        page: path,
        source: source,
        visitDuration: durationInSeconds,
        isBounceVisit: !userInteracted,
        domain: window.location.hostname,
        isUniqueVisit: uniqueVisit
    };

    try {
        const apiUrl = `https://web-analytics-production.up.railway.app/`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
            keepalive: true
        })

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error: ', error)
    }
});

async function getUserCountry() {
    try {
        const response = await fetch('https://ipinfo.io?token=2f9a4aeaf877be');
        const data = await response.json();
        const country = data.country;
        return country;
    } catch (error) {
        console.error("Error fetching user's country: " + error);
        return null; // You may choose to return a default value or handle the error differently
    }
}

function detectDeviceType() {
    // Regular expressions for various device types
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Mobile Safari|Mobile\ssafari|Silk|Kindle|Dolfin|Opera Mini|Opera Mobi|Fennec/i;
    const tabletRegex = /iPad|Tablet|Nexus|Amazon Kindle|Touch|PlayBook|Tablet\sOS|Silk|Kindle|KFOT|KFJWI|KFSOWI|KFTHWI|KFMAWI|KFTT|KFJWA|KFJWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFFOWI|KFMEWI|KFSAWA|KFTBWI/i;
    const tvRegex = /SmartTV|Television|TV/i;
    const gamingConsoleRegex = /PlayStation|Xbox|Nintendo/i;
    const wearableRegex = /Smartwatch|Wearable/i;
    const desktopRegex = /Windows|Macintosh|Linux|Ubuntu/i;

    // User agent string
    const userAgent = navigator.userAgent;

    // Check if the user agent string matches any of the regex patterns
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
        return "Unknown"; // If none of the patterns match
    }
}


// this script tracks the following: user device type (mobile, desktop), time spent visitng site, user country, the current url path (/about, /contact). All data is collected anonymously and is compliant with the EU's strict GDPR data security standards.