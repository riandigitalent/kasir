import express from 'express'
import Transaksi from '../models/transaksiModel.js'

const router = express.Router()

export default router

router.post('/Transaksi', async(req, res) => {
    try {
        const {
            namaTransaksi,
            konsumen,
            jumlah,
            harga,
            iduser
        } = req.body
        const transaksi = new Transaksi({
            namaTransaksi,
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

router.get('/Transaksi', async(req, res) => {
    const transaksi = await Transaksi.find({})
    if (transaksi) {
        res.json(transaksi)
    } else {
        res.status(404).json({ message: 'transaksi not found' })
    }
})

router.get('/Transaksi/:id', async(req, res) => {
    const transaksi = await Transaksi.findById(req.params.id)
    if (transaksi) {
        res.json(transaksi)
    } else {
        res.status(404).json({ message: 'transaksi not found' })

    }
})

router.put('/Transaksi/:id', async(req, res) => {
    const {
        namaTransaksi,
        konsumen,
        jumlah,
        harga,
        iduser
    } = req.body

    const transaksi = await Transaksi.findById(req.params.id)
    if (transaksi) {
        transaksi.namaTransaksi = namaTransaksi
        transaksi.konsumen = konsumen
        transaksi.harga = harga
        transaksi.iduser = iduser

        const updateTransaksi = await transaksi.save()
        res.json(updateTransaksi)

    } else {
        res.status(404).json({ message: 'transaksi not found' })
    }

})


router.delete('/Transaksi/:id', async(req, res) => {
        const transaksi = await Transaksi.findById(req.params.id)
        if (transaksi) {
            await transaksi.remove()
            res.json({ message: 'transaksi remove' })

        } else {
            res.status(404).json({ message: 'transaksi not found' })
        }

    })
    //del all
router.delete('/Transaksi', async(req, res) => {
    const transaksi = await Transaksi.find()
    if (transaksi) {
        await transaksi.remove({})
        res.json({ message: 'transaksi remove' })

    } else {
        res.status(404).json({ message: 'transaksi not found' })
    }

})