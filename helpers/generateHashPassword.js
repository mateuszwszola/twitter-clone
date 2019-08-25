const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

module.exports = async function(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
};