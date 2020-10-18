import User from '../models/UserModel.js';
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import VerifyToken from '../auth/VerifyToken.js'
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
dotenv.config();



const userRouter = express.Router();

userRouter.use(bodyParser.urlencoded({ extended: false }));
userRouter.use(bodyParser.json());


// tambah user
userRouter.post('/add', async(req, res) => {
    const data = req.body;
    var hashedPassword = bcrypt.hashSync(data.password, 12);
    User.create({
            username: data.username,
            password: hashedPassword,
            role: data.role
        },
        function(err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")

            // create a token
            const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '86400s' });
            res.status(200).send({ auth: true, token: token } + user);
        });
    /// res.status(200).send({ auth: true, token: token });

})


//login
userRouter.post('/login', async(req, res) => {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        // check if the password is valid
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ user }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.status(200).send({ auth: true, token: token });
    });

});

//getalluser
userRouter.get('/all', async(req, res) => {
    const users = User.find({})
    if (users) {
        res.json(users)
    } else {
        res.status(404).json({ message: 'Users not found' })
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
    } = req.body

    let saltRound = 10
    const hashedPW = await bcrypt.hash(password, saltRound);

    const users = await User.findById(req.params.id)
    if (users) {
        users.username = username
        users.password = hashedPW
        users.role = role

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


userRouter.get('/check', async(req, res) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send(decoded);
    });
});

export default userRouter;