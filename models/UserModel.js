import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'kasir',
        enum: ["kasir", "manager", "bos"]
    }
}, {
    timestamps: true,
});
const User = mongoose.model('User', userSchema)

export default User