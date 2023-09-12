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
    const { domain } = req.params;
    const { country, device, page, source, visitDuration, isBounceVisit } = req.body; // Assuming the request body contains the data to update

    try {
        let trafficData = await Traffic.findOne({ domain });

        if (!trafficData) {
            // If traffic data for the domain doesn't exist, create a new entry
            trafficData = new Traffic({ domain });
        }

        const matchingDailyTraffic = trafficData.dailyTraffic.find(entry => {
            const entryDateISOString = entry.date.toISOString().split("T")[0];
            return entryDateISOString.startsWith(date.split("T")[0]);
        });

        if (matchingDailyTraffic) {
            const countryEntryIndex = matchingDailyTraffic.countryData.findIndex(entry => entry.country === country);

            if (countryEntryIndex !== -1) {
                // Country entry exists, increment its value by 1
                matchingDailyTraffic.countryData[countryEntryIndex].value += 1;
            } else {
                // Country entry doesn't exist, create a new entry with value 1
                matchingDailyTraffic.countryData.push({ country, value: 1 });
            }

            const sourceEntryIndex = matchingDailyTraffic.sourceData.findIndex(entry => entry.source === source);

            if (sourceEntryIndex !== -1) {
                // Source entry exists, increment its value by 1
                matchingDailyTraffic.sourceData[sourceEntryIndex].value += 1;
            } else {
                // Source entry doesn't exist, create a new entry with value 1
                matchingDailyTraffic.sourceData.push({ name: source, value: 1 });
            }

            const pageEntryIndex = matchingDailyTraffic.pageData.findIndex(entry => entry.page === page);

            if (pageEntryIndex !== -1) {
                // Page entry exists, increment its value by 1
                matchingDailyTraffic.pageData[pageEntryIndex].value += 1;
            } else {
                // Page entry doesn't exist, create a new entry with value 1
                matchingDailyTraffic.pageData.push({ name: page, value: 1 });
            }

            const deviceEntryIndex = matchingDailyTraffic.deviceData.findIndex(entry => entry.device === device);

            if (deviceEntryIndex !== -1) {
                // Device entry exists, increment its value by 1
                matchingDailyTraffic.deviceData[deviceEntryIndex].value += 1;
            } else {
                // Device entry doesn't exist, create a new entry with value 1
                matchingDailyTraffic.deviceData.push({ name: device, value: 1 });
            }

            const recentHourlyTraffic = matchingDailyTraffic.hourlyTraffic[-1];
            recentHourlyTraffic.visits += 1
            if (isBounceVisit) {
                recentHourlyTraffic.bounceVisit += 1
            }
            recentHourlyTraffic.visitDuration += visitDuration


            await trafficData.save();
        }

        res.status(200).json(trafficData);
    } catch (error) {
        res.status(500).json({ message: 'Error updating traffic data', error: error.message });
    }
});



module.exports = {
    getTraffic,
    updateTraffic
};