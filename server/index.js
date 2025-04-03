require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const apiRouter = require('./routers');

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routers
app.use('/api', apiRouter);

mongoose.connect(process.env.MONGO_CONNECTION_STRING ?? "mongodb://localhost:27017/amirneta")
.then(() => {
    console.log('connected to mongoDB')
    const port = process.env.PORT ?? 3001;
    app.listen(port, () => console.log(`server listen on port ${port}`));
})
.catch(err => console.log(err));