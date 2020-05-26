const userService = require('./../services/userService');

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
* /users/authenticate:
*   get:
*     tags:
*       - Users
*     description: Authenticates the user
*     produces:
*       - application/json
*     responses:
*       200:
*         description: A user object
*         schema:
            "$ref": '#/definitions/User'
*/
function authenticate(req, res, next) {
    userService
        .authenticate(req.body)
        .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' })))
        .catch((err) => next(err));
}

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
async function getUsers(req, res) {
    try {
        res.send(await userService.getAll());
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getUsers, authenticate };
