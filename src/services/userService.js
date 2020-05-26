const userRepository = require('./../dataAccess/userRepository');

async function authenticate({ userName, password }) {
    const user = await userRepository.getForAuth(userName, password);
    if (user) {
        return user;
    }
}

async function getAll() {
    return userRepository.getUsers();
}

module.exports = {
    authenticate,
    getAll,
};
