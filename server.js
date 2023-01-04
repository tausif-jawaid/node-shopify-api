require('dotenv').config();
const express = require('express');
const metafieldsRoutes = require('./routes/metafields')
const productsRouts = require('./routes/products')
//const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors')

// express app
const app = express();
app.use(express.json())
app.use(cors())

app.use((req,res,next) => {
    console.log(req.path,req.method)
    next()
})

app.use('/api/shopify/metafields',metafieldsRoutes);
app.use('/api/shopify/products',productsRouts)

const server = app.listen(process.env.PORT, () =>{
    console.log(' connected to DB listening on port',process.env.PORT)
})

