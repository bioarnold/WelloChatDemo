const express = require('express');
const app = express();
const routes = require('./routes');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const port = 8000;

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'WelloChat Demo API',
        version: '1.0.0',
        description: 'WelloChat Demo API',
    },
    host: `localhost:${port}`,
    basePath: '/',
};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./src/controllers/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

let generatedHtml;
app.use(
    '/swagger',
    (req, res, next) => {
        const opts = {
            swaggerOptions: {
                urls: [{ url: '/swagger.json', name: 'swagger.json' }],
            },
        };

        generatedHtml = swaggerUi.generateHTML(null, opts);
        next();
    },
    swaggerUi.serve,
    (req, res) => res.send(generatedHtml)
);

app.use('/', routes);

const server = app.listen(port, () => {
    console.log('Server listening on port 8000!');
});

const stop = () => {
    server.close();
};

module.exports = app;
module.exports.stop = stop;
