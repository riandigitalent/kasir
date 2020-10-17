import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

//ambil config env
dotenv.config();

//inisiasi app
const app = express()
    // konek dan cek mongose DB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => {
    console.log('Connect to DB success')
}).catch(err => {
    console.log('Connect to failed ' + err)
})


//simple Welcome

app.get('/', (req, res, next) => {
    res.json({
        message: 'selamat datang di sistem kasir '
    })
})

//setting port listen
app.listen(process.env.PORT, () => {
    console.log(`app jalan di ${process.env.PORT}`)
})