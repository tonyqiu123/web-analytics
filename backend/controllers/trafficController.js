const asyncHandler = require('express-async-handler');
const Traffic = require('../models/trafficModel');

const getTraffic = asyncHandler(async (req, res) => {
    const { domain, date } = req.query;

    try {
        const trafficData = await Traffic.findOne({ domain });

        if (trafficData) {
            const matchingDailyTraffic = trafficData.dailyTraffic.find(entry => {
                const entryDateISOString = entry.date.toISOString().split("T")[0];
                return entryDateISOString.startsWith(date.split("T")[0]);
            });

            if (matchingDailyTraffic) {
                res.status(200).json(matchingDailyTraffic);
            } else {
                res.status(404).json({ message: 'Traffic data not found for the provided date and domain' });
            }
        } else {
            res.status(404).json({ message: 'Traffic data not found for the provided domain' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch traffic data', error: error.message });
    }
});


const updateTraffic = asyncHandler(async (req, res) => {
    const { country, device, page, source, visitDuration, isBounceVisit, domain, isUniqueVisit } = req.body;

    function generateHourArray() {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();

        const hourArray = [];

        for (let hour = 0; hour <= currentHour; hour++) {
            const hourString = hour.toString().padStart(2, '0') + ':00';
            hourArray.push({ hour: hourString });
        }

        return hourArray;
    }

    try {
        let trafficData = await Traffic.findOne({ domain });
        if (!trafficData) {
            trafficData = await Traffic.create({ domain, dailyTraffic: [{ hourlyTraffic: generateHourArray() }] });
        }

        let matchingDailyTraffic = trafficData.dailyTraffic[trafficData.dailyTraffic.length - 1];
        const initializeArray = (data, key) => {
            if (!data[key]) {
                data[key] = [];
            }
        };


        const updateEntry = (array, key) => {
            const entryIndex = array.findIndex(entry => entry.name === key);
            if (entryIndex !== -1) {
                array[entryIndex].value += 1;
            } else {
                array.push({ name: key, value: 1 });
            }
        };

        const updateEntryCountry = (array, key) => {
            const entryIndex = array.findIndex(entry => entry.country === key);
            if (entryIndex !== -1) {
                array[entryIndex].value += 1;
            } else {
                array.push({ country: key, value: 1 });
            }
        };

        if (isUniqueVisit) {

            initializeArray(matchingDailyTraffic, 'countryData');
            initializeArray(matchingDailyTraffic, 'sourceData');
            initializeArray(matchingDailyTraffic, 'pageData');
            initializeArray(matchingDailyTraffic, 'deviceData');

            updateEntryCountry(matchingDailyTraffic.countryData, country);
            updateEntry(matchingDailyTraffic.sourceData, source);
            updateEntry(matchingDailyTraffic.pageData, page);
            updateEntry(matchingDailyTraffic.deviceData, device);
        }

        const recentHourlyTraffic = matchingDailyTraffic.hourlyTraffic[matchingDailyTraffic.hourlyTraffic.length - 1];

        recentHourlyTraffic.visits += 1;

        if (isBounceVisit) {
            recentHourlyTraffic.bounceVisit += 1;
        }

        if (isUniqueVisit) {
            recentHourlyTraffic.uniqueVisits += 1;
        }

        recentHourlyTraffic.visitDuration += visitDuration;

        await trafficData.save();

        res.status(200).json(trafficData);
    } catch (error) {
        res.status(500).json({ message: 'Error updating traffic data', error: error.message });
    }
});





module.exports = {
    getTraffic,
    updateTraffic
};