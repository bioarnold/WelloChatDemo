const userRepository = require('./../dataAccess/userRepository');
const transformer = require('./../transformers/userTransformer');

async function authenticate({ userName, password }) {
    const user = await userRepository.getForAuth(userName, password);
    if (user) {
        return user;
    }
}

async function getAll(showProtected) {
    return transformer.transformList(await userRepository.getUsers(), showProtected);
}

function addUser(user) {
    if (!user) return;

    return userRepository.addUser(user);
}

module.exports = {
    authenticate,
    getAll,
    addUser,
};
