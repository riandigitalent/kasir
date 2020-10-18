import User from '../models/UserModel.js';
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const config = ('../config/config.js')
import bodyParser from 'body-parser';

const userRouter = express.Router();
userRouter.use(bodyParser.urlencoded({ extended: false }));
userRouter.use(bodyParser.json());


// tambah user
userRouter.post('/add', async(req, res) => {
    try {
        const {
            username,
            password,
            role
            //,accessToken
        } = req.body;

        console.log(username)

        const users = await User.find({ username: username })
            //
        let saltRound = 10
        const hashedPW = await bcrypt.hash(password, saltRound);

        const newUser = new User({
            "username": username,
            "password": hashedPW,
            "role": role
                //,"accessToken": accessToken
        })

        const createdUser = await newUser.save();
        // create a token
        var token = jwt.sign({ id: newUser._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
        //
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//login
userRouter.post('/login', async(req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ username: data.username });

        if (!!user) {
            if (await bcrypt.compare(data.password, user.password)) {
                const userToken = {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                }

                const token = jwt.sign({ userToken }, config.SECRET, { expiresIn: '86400s' });
                res.status(200).json({
                    message: 'Login berhasil',
                    token,
                })
            } else {
                res.send(404).json({ message: 'login gagal' })
            }
        } else {
            res.send(404).json({ message: 'login gagal' })
        }
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

//getuser by id
userRouter.get('/info/:id', async(req, res) => {
    const users = await User.findById(req.params.id)
    if (users) {
        res.json(users)
    } else {
        res.status(404).json({ message: 'Users not found' })
    }
})

//put update

userRouter.put('/update/:id', async(req, res) => {
    const {
        username,
        password,
        role
        //,accessToken
    } = req.body

    let saltRound = 10
    const hashedPW = await bcrypt.hash(password, saltRound);

    const users = await User.findById(req.params.id)
    if (users) {
        users.username = username
        users.password = hashedPW
        users.role = role
            //   ,users.accessToken = accessToken

        const updateUser = await user.save()
        res.json(updateUser)

    } else {
        res.status(404).json({ message: 'homework not found' })
    }

})

userRouter.delete('/del/:id', async(req, res) => {
    const users = await User.findById(req.params.id)
    if (users) {
        await User.remove()
        res.json({ message: 'terdelete 1  remove' })
    } else {
        res.status(404).json({ message: 'Users not found' })
    }
})



export default userRouter;