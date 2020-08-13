const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')

//Enviroment var
dotenv.config();
var port = process.env.PORT || '5000';
var dbConnection = process.env.DB_CONNECT;

//Import Routes
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

//Connect to the DB
mongoose.connect(dbConnection,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log('Connected to DB');
    }
);

//Middleware
app.use(express.json());
app.use(cors())

//Router middlewares
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

//Listen
app.listen(port, () => {
    console.log("Server up and listening in port:",port);
});