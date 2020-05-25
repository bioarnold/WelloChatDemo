const userRepository = require('./../dataAccess/userRepository');

// Display book create form on GET.
exports.getUsers = async function (req, res) {
    try {
        res.send(await userRepository.getUsers());
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
