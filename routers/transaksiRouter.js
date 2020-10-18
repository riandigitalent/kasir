import express from 'express'
import Transaksi from '../models/transaksiModel.js'
import User from '../models/UserModel.js'
import Conf from '../config/config.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const transRouter = express.Router();



transRouter.post('/baru', async(req, res) => {

    try {


        const {
            detailtransaksi,
            konsumen,
            jumlah,
            harga,
            iduser
        } = req.body
        console.log(detailtransaksi)
        const transaksi = new Transaksi({
            detailtransaksi,
            konsumen,
            jumlah,
            harga,
            iduser
        })

        const createdTransaksi = await transaksi.save()
        res.status(201).json(createdTransaksi)
    } catch (err) {
        res.status(500).json({ error: 'database creation error' })
    }
})

transRouter.get('/List', async(req, res) => {
    const transaksi = await Transaksi.find({})
    if (transaksi) {
        res.json(transaksi)
    } else {
        res.status(404).json({ message: 'transaksi not found' })
    }
})

transRouter.get('/check/:id', async(req, res) => {
    const transaksi = await Transaksi.findById(req.params.id)
    if (transaksi) {
        res.json(transaksi)
    } else {
        res.status(404).json({ message: 'transaksi not found' })

    }
})

transRouter.put('/Koreksi/:id', async(req, res) => {
    const {
        detailtransaksi,
        konsumen,
        jumlah,
        harga,
        iduser
    } = req.body

    const transaksi = await Transaksi.findById(req.params.id)
    if (transaksi) {
        transaksi.detailtransaksi = detailtransaksi
        transaksi.konsumen = konsumen
        transaksi.jumlah = jumlah
        transaksi.harga = harga
        transaksi.iduser = iduser

        const updateTransaksi = await transaksi.save()
        res.json(updateTransaksi)

    } else {
        res.status(404).json({ message: 'transaksi not found' })
    }

})


transRouter.delete('/Hapus/:id', async(req, res) => {
        const transaksi = await Transaksi.findById(req.params.id)
        if (transaksi) {
            await transaksi.remove()
            res.json({ message: 'transaksi remove' })

        } else {
            res.status(404).json({ message: 'transaksi not found' })
        }

    })
    //del all
transRouter.delete('/hapussemua', async(req, res) => {
    const transaksi = await Transaksi.find()
    if (transaksi) {
        await transaksi.remove({})
        res.json({ message: 'transaksi remove' })

    } else {
        res.status(404).json({ message: 'transaksi not found' })
    }

})


transRouter.post('/saldo', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const jabatan = decoded.user.jabatan;
        if (jabatan === 'kasir') {

            Kasir.create({
                "jenis_transaksi": `${decoded.user.nama_belakang} Melihat Saldo total Status Tidak Memiliki wewenang`

            }, function(err, user) {
                if (err) return res.status(500).send("There was a problem transaksi.")
            });


            res.status(200).send(`${decoded.user.nama_belakang} Tidak Memiliki Wewenang`);
        } else {

            Kasir.create({
                "jenis_transaksi": `${decoded.user.nama_belakang} Melihat Saldo Total Status Bisa Melakukan`

            }, function(err, user) {
                if (err) return res.status(500).send("There was a problem transaksi.")
            });

            res.status(200).send(`${decoded.user.nama_belakang} Bisa Melakukan`);
        }
    });
});


transRouter.post('/ambiluang', function(req, res) {
    //header apabila akan melakukan akses
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    //verifikasi jwt
    jwt.verify(token, Conf.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        const jabatan = decoded.user.role;
        console.log(decoded);
        if (jabatan === 'kasir' || jabatan === 'manager') {

            Kasir.create({
                "jenis_transaksi": `${decoded.user.nama_belakang} Mengambil Uang Status Tidak Memiliki Wewenang`

            }, function(err, user) {
                if (err) return res.status(500).send("There was a problem transaksi.")
            });

            res.status(200).send(`${decoded.user.nama_belakang} Tidak Memiliki Wewenang`);
        } else {

            Kasir.create({
                "jenis_transaksi": `${decoded.user.nama_belakang} Mengambil Uang Status Bisa Melakukan`

            }, function(err, user) {
                if (err) return res.status(500).send("There was a problem transaksi.")
            });
            res.status(200).send(`${decoded.user.nama_belakang} Bisa Melakukan`);
        }
    });
});



export default transRouter