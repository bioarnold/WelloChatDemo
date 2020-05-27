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
 *       profileImage:
 *         type: string
 *   CreateUserRequest:
 *     properties:
 *       userName:
 *         type: string
 *       password:
 *         type: string
 *       email:
 *         type: string
 *       profileImage:
 *         type: string
 *       isAdmin:
 *         type: boolean
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *
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
async function getUsers(req, res, next) {
    userService
        .getAll(!!req.user)
        .then((users) => res.json(users))
        .catch((err) => next(err));
}

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates user
 *     parameters:
 *     - in: body
 *       name: body
 *       schema:
 *         "$ref": "#/definitions/CreateUserRequest"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The created user object
 *         schema:
 *             "$ref": '#/definitions/User'
 *       403:
 *         description: FORBIDDEN if the user is not an admin
 */
async function addUser(req, res, next) {
    if (!req.user.isAdmin) {
        res.status(403);
        return res.json({ error: 'Forbidden' });
    }

    if (!validateCreateRequest(req)) {
        res.status(400);
        return res.json({ error: 'Invalid request' });
    }

    userService
        .addUser(req.body)
        .then((user) => res.json(user))
        .catch((err) => next(err));
}

function validateCreateRequest(req) {
    if (!req || !req.body) {
        return false;
    }

    const expectedProps = ['userName', 'password', 'email', 'isAdmin', 'profileImage'];

    for (const prop of expectedProps) {
        if (!(prop in req.body)) return false;
    }

    return true;
}

module.exports = { getUsers, addUser };
