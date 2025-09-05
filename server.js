const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();




app.use(express.json());


app.listen( PORT , () => {
    console.log(`Server started successfully at ${PORT}`)
});




app.use('/api/')






app.use(errorHandler);
