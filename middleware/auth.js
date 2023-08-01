const jwt = require('jsonwebtoken');
const User = require('../modules/user/User.js');

module.exports = async function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // Check if the user exists in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the token exists in the database
        const tokenExists = user.tokens.find((t) => t.token === token);
        if (!tokenExists) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
