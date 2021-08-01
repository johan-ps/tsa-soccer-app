const jwt = require('jsonwebtoken');
const User = require("../models/User");

exports.isAuth = (req, res, next) => {
    if (req.headers && req.headers['x-auth-token']) {
        const token = req.headers['x-auth-token'].split(' ')[1];

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const [user, _] = User.findOneById(decode.id);
            if (user && user.length === 1) {
                next();
            }
        } catch (error) {
            next(error);
        }
    } else {
        res.json({ success: false, message: 'Unauthorized access' })
    }
};