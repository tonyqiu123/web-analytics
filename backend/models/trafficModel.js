const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    country: { type: String, required: true },
    value: { type: Number, required: true, default: 0 }
});

const sourceSchema = new mongoose.Schema({
    source: { type: String, required: true },
    value: { type: Number, required: true, default: 0 }
});

const pageSchema = new mongoose.Schema({
    page: { type: String, required: true },
    value: { type: Number, required: true,  default: 0 }
});

const deviceSchema = new mongoose.Schema({
    device: { type: String, required: true },
    value: { type: Number, required: true, default: 0 }
});

const hourlyTrafficSchema = new mongoose.Schema({
    hour: { type: String, required: true },
    uniqueVisitors: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    bounceVisit: { type: Number, default: 0 }, 
    visitDuration: { type: Number, default: 0 }, 
    countryData: { type: [countrySchema], default: [] }, 
    sourceData: { type: [sourceSchema], default: [] }, 
    pageData: { type: [pageSchema], default: [] }, 
    deviceData: { type: [deviceSchema], default: [] } 
});


const dailyTrafficSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    hourlyTraffic: { type: [hourlyTrafficSchema], default: [] }
});


const trafficSchema = new mongoose.Schema({
    domain: String,
    dailyTraffic: { type: [dailyTrafficSchema], default: [] }
});


const TrafficData = mongoose.model('Traffic', trafficSchema);
module.exports = TrafficData;
