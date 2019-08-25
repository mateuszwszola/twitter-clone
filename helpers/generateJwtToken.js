const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

module.exports = async function(user_id) {
    const payload = {
        user: {
            id: user_id
        }
    };

    return await jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 });
};