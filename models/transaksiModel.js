import mongoose from 'mongoose';

const transaksiSchema = mongoose.Schema({
        detailtransaksi: {
            type: String,
            required: true,
        },
        konsumen: {
            type: String,
            required: true,
        },
        jumlah: {
            type: String,
            required: true,
        },
        harga: {
            type: String,
            required: true,
        },
        iduser: {
            type: String,
            required: true,
        },
    }, {
        timestamp: true,
    }

)

const Transaksi = mongoose.model('Transaksi', transaksiSchema)

export default Transaksi