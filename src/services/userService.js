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

module.exports = {
    authenticate,
    getAll,
};
