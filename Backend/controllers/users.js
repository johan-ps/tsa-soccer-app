const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

exports.getAllUsers = async (req, res, next) => {
    try {
        const [users, _] = await User.findAll();

        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.body;
        const [user, _] = await User.findOneById(id);
        
        res.status(200).json({ user })
    } catch (error) {
        next (error);
    }
}

exports.loginUser = async (req, res, next) => {
    const { username = null, password = null } = req.body;

    try {
        if (username && password) {
            const [[user], _] = await User.findOneByUsername(username);
            // generate hashed password
            const valid = await bcrypt.compare(password, user.password)
            
            if (valid) {
                // generate token
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
                res.status(200).json({ success: true, user, token });
            } else {
                res.status(404).json({ success: false, message: "Invalid username or password" });
            }
        } else {
            res.status(404).json({ success: false, message: "Invalid username or password" });
        }
    } catch (error) {
        next(error);
    }
}

exports.session = async (req, res, next) => {
    if (req.headers && req.headers['x-auth-token'] && req.headers['x-auth-token'].split(' ')[1]) {
        const token = req.headers['x-auth-token'].split(' ')[1];

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const [user, _] = await User.findOneById(decode.id);

            if (user && user.length === 1) {
                res.status(200).json({ success: true, user: user[0] });
            }
        } catch (error) {
            next(error);
        }
    } else {
        res.json({ success: false, message: 'Unauthorized access' })
    }
}

exports.addUser = async (req, res, next) => {
    const {
        username = null,
        password = null,
        firstName = null,
        lastName = null,
        profileImg = null,
        email = null,
        role = null,
        position = null,
        phoneNum = null,
        accessLevel = null
    } = req.body;

    try {
        // generate hashed password
        const hashedPswd = await bcrypt.hash(password, 10);
        const newUser = new User(
            username,
            hashedPswd,
            firstName,
            lastName,
            profileImg,
            email,
            role,
            position,
            phoneNum,
            accessLevel
        );
        const [user, _] = await newUser.save();
        // generate token
        // const token = jwt.sign({ id: User.id }, process.env.JWT_SECRET);
        res.status(200).json({ success: true, user: { ...newUser, id: user.insertId } });
    } catch (error) {
        next(error);
    }
}

exports.updateById = async (req, res, next) => {
    try {
        const { firstName, lastName, phoneNum, email } = req.body;
        let profileImg = null
        
        let imageBuffer = req.file;
        if (imageBuffer && imageBuffer.buffer) {
            imageBuffer = imageBuffer.buffer
            const { width, height } = await sharp(imageBuffer).metadata();
            imageBuffer = await sharp(imageBuffer).resize(90, 90).toBuffer()
            profileImg = `data:${req.file.mimetype};base64,` + imageBuffer.toString('base64')
        }
        
        const [user, _] = await User.updateOneById(req.user.id, {
            firstName, lastName, phoneNum, email, profileImg,
        })
        res.status(200).json({ id: req.user.id, firstName, lastName, phoneNum, email, profileImg });
    } catch (error) {
        next(error);
    }
    return null
}

exports.deleteById = async (req, res, next) => {
    return null
}