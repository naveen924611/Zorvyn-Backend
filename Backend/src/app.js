
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const app = express();

//auth routes
const authRoute = require('./routes/auth.route');
//user operations routes
const userRoute = require('./routes/user.route');
//record operations routes
const recordRoute = require('./routes/record.route');
// dashboard routes
const dashboardRoute = require('./routes/dashboard.routes');

// Middleware
app.use(cors({
    origin: '*', // Adjust this to your frontend URL
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/auth', authRoute);
app.use('/api', userRoute, recordRoute, dashboardRoute);

// app.use('*', require('./utils/error')); --> THIS WILL CATCH ALL UNREGISTERED ENDPOINTS AND RETURN A 404 ERROR( express-5 and newer version don't support )
app.use(require('./utils/error'));
module.exports = app;