const express = require('express');
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const { errorHandler } = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const TrafficData = require('./models/trafficModel');




// Connect to DB
(async () => {

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.DB_URL)

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
})()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

app.set('trust proxy', true);
const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 120, // Limit each IP to 120 requests per 1 minute
    keyGenerator: (req) => {
        return req.ip; // Use client IP for rate limiting
    },
    message: 'Too many requests from this IP, please try again later',
});
// Apply rate limiting middleware to all routes
app.use(rateLimiter);


// Enable CORS
app.use(cors());

// Configure Content-Security-Policy (CSP)
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'"],
            styleSrc: ["'self'"],
        },
    })
);


app.use('/', require('./routes/trafficRoutes'))

app.use(errorHandler)

cron.schedule('0 * * * *', async () => {
    try {
        const currentDate = new Date();
        const currentHour = currentDate.getHours()
        const isFirstHour = currentHour === 0;

        const updateOperations = [];

        const entries = await TrafficData.find({});

        for (const domain of entries) {
            if (isFirstHour) {
                domain.dailyTraffic.push({});
            } else {
                domain.dailyTraffic[domain.dailyTraffic.length - 1].hourlyTraffic.push({ hour: currentHour.padStart(2, '0') + ':00' });
            }

            // Prepare the update operation for each document
            const updateOperation = {
                updateOne: {
                    filter: { _id: domain._id },
                    update: { $set: domain.toObject() },
                },
            };

            updateOperations.push(updateOperation);
        }

        if (updateOperations.length > 0) {
            // Execute bulk update with updateMany
            await TrafficData.bulkWrite(updateOperations);
        }

        console.log('Data update complete.');
    } catch (error) {
        console.log('Failed to update data:', error);
    }
});

app.listen(port, () => console.log(`Server started on port ${port}`));