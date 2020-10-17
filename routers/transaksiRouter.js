import express from 'express'
import Transaksi from '../models/transaksiModel.js'

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

export default transRouter