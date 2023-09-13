const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    country: { type: String, default: 'unknown' },
    value: { type: Number, default: 0 }
});

const sourceSchema = new mongoose.Schema({
    name: { type: String, default: 'unknown' },
    value: { type: Number, default: 0 }
});

const pageSchema = new mongoose.Schema({
    name: { type: String, default: 'unknown' },
    value: { type: Number, default: 0 }
});

const deviceSchema = new mongoose.Schema({
    name: { type: String, default: 'unknown' },
    value: { type: Number, default: 0 }
});

const hourlyTrafficSchema = new mongoose.Schema({
    hour: {
        type: String,
        default: function () {
            const currentHour = new Date().getHours();
            // Format the hour with leading zeros and set the minute part to '00'
            const formattedHour = currentHour.toString().padStart(2, '0');
            return `${formattedHour}:00`;
        }
    },
    visits: { type: Number, default: 0 },
    bounceVisit: { type: Number, default: 0 },
    visitDuration: { type: Number, default: 0 }
});

const dailyTrafficSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    hourlyTraffic: { type: [hourlyTrafficSchema], default: [] },
    countryData: { type: [countrySchema], default: [] },
    sourceData: { type: [sourceSchema], default: [] },
    pageData: { type: [pageSchema], default: [] },
    deviceData: { type: [deviceSchema], default: [] }
});


const trafficSchema = new mongoose.Schema({
    domain: { type: String, required: true },
    dailyTraffic: { type: [dailyTrafficSchema], default: [] }
});


const TrafficData = mongoose.model('Traffic', trafficSchema);
module.exports = TrafficData;
