const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const authRouter = require('./routes/authRoute');


const app = express();

// 1) MIDDLEWARES
// app.use(cors());
app.use(express.json());

// // 2) ROUTE
app.use('/user', authRouter);


// // 3) MOONGO DB CONNECTION
const Mongo_Url = "mongodb+srv://ayush:12345@cluster0.oo018hf.mongodb.net/UserAuth";  

mongoose.connect(Mongo_Url)
    .then(() => {
        console.log('Connected to MongoDB!')
    }).catch((error) => {
        console.error('Failed to connect to MongoDB: ', error);
    });

// // 4) GLOVAL ERROR HANDLER
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

// 5) SERVER
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

