import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import config from '../config/config.js'

const verifyToken = express.Router();

async function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!!token) {
        try {
            const decoded = await jwt.verify(token.split(" ")[1], config.SECRET);
            const id = decoded.userToken.id;
            const user = await User.findById(id).exec();
            if (!!user) next()
            else res.status(401).json({ message: 'token gak valid' });
        } catch (err) {
            res.status(401).json({ message: 'token gak valid' });
        };
    } else {
        res.status(401).json({ message: 'token gak valid' });
    };
};
export default verifyToken