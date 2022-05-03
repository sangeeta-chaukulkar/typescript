const jwt = require('jsonwebtoken');
const AuthUser = require('../models/user');
const authenticate = (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        console.log(token);
        const userid = Number(jwt.verify(token, process.env.TOKEN_SECRET).id);
        console.log(jwt.verify(token, process.env.TOKEN_SECRET));
        console.log(userid);
        AuthUser.findByPk(userid).then(user => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch(err => { throw new Error(err); });
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
        // err
    }
};
module.exports = {
    authenticate
};
