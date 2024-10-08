require('dotenv').config();
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bullBoardRouter = require("./bullboard")
const cors = require('cors')
require('./queues/emailQueue');
require('./queues/orderQueue');

// Swagger Imports
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const connectDB = require('./db');
if (process.env.ENVIRONMENT === 'development') {
    connectDB();
}

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your React app's URL
    credentials: true // Allow credentials like cookies to be sent
}));

// Defaults
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cookieParser());

// Include the Bull Board UI
app.use('/api/admin/queues', bullBoardRouter);

// Routes Imports
const userRoute = require('./routes/userRoutes')
const vehicleRoute = require('./routes/vehicleRoutes')
const cartRoute = require('./routes/cartRoutes')
const orderRoute = require('./routes/orderRoutes');
const wishlistRoute = require('./routes/wishlistRoute')

// Routes Middleware
app.use('/api', userRoute);
app.use('/api', vehicleRoute);
app.use('/api', cartRoute);
app.use('/api', orderRoute);
app.use('/api', wishlistRoute);

// Swagger UI Documenation
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(9898, () => {
    console.log('Server started on http://localhost:9898');
});


module.exports = app;


