const express = require('express')
const dotenv = require('dotenv/config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
// routes configuration
const UserRouter = require('./routes/user')
const infoRouter=require('./routes/info')


// for json view in body parser
app.use(bodyParser.json())
// for database connection

mongoose.connect(process.env.DB_CONFIG)
    .then(() => {
        console.log("DateBase Connected Successfully")
    }).catch((err) => {

        console.log(err);
    })

 

// routes middlewares
app.use('/api/user', UserRouter)
app.use('/api/info',infoRouter)




const port = process.env.PORT


app.listen(port, () => {
    console.log(`server is connected to ${port}`);
}) 