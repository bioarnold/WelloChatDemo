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

async function addUser(user) {
    if (!user) return;

    return transformer.transform(await userRepository.addUser(user), true);
}

async function getUser(id, showProtected) {
    return transformer.transform(await userRepository.getUser(id), showProtected);
}

function removeUser(id) {
    return userRepository.removeUser(id);
}

module.exports = {
    authenticate,
    getAll,
    addUser,
    getUser,
    removeUser,
};
