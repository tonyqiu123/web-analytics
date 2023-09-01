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
    const { country, device, page, source, visitDuration } = req.body; // Assuming the request body contains the data to update

    try {
        let trafficData = await Traffic.findOne({ domain });

        if (!trafficData) {
            // If traffic data for the domain doesn't exist, create a new entry
            trafficData = new Traffic({ domain });
        }

        // Update existing data fields
        trafficData.uniqueVisitors += data.uniqueVisitors || 0;
        trafficData.visits += data.visits || 0;
        trafficData.pageViews += data.pageViews || 0;

        // Update or add entries to arrays
        trafficData.countryData.push(...(data.countryData || []));
        trafficData.sourceData.push(...(data.sourceData || []));
        trafficData.pageData.push(...(data.pageData || []));
        trafficData.deviceData.push(...(data.deviceData || []));

        // Save the updated or new data
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