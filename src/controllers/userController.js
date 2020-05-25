const userRepository = require('./../dataAccess/userRepository');

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       userName:
 *         type: string
 *       email:
 *         type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           type: array
 *           items:
 *             "$ref": '#/definitions/User'
 */
exports.getUsers = async function (req, res) {
    try {
        res.send(await userRepository.getUsers());
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
