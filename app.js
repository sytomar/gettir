const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUI = require('swagger-tools/middleware/swagger-ui');
const errorHandler = require('./helpers/errorHandler');
const multer = require('./helpers/multer-utils');
const config = require('config');

// const logging = require('./helpers/logging');

// logging.debug(null, "Overriding 'Express' logger");
var app = express();
app.use(logger('combined'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer.multerUpload.fields(config.multer.fieldNames));

// app.use(errorHandler.logInitRequest);
// app.use(logging.requestLogger);

// Swagger setup
const swaggerConfig = {
    appRoot: __dirname, // required config
    swaggerFile: __dirname + '/apiDocs/swagger/swagger.yaml'
};

SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
    if (err) {
        throw err;
    }
    app.use((req, res, next) => {
            next();
        });
    // install middleware
    swaggerExpress.register(app);
    // Disable in production
    app.use(SwaggerUI(swaggerExpress.runner.swagger));
    // Error handler
    app.use((err, req, res, next) =>{
        return errorHandler.handler(err, req, res);
    });
});

app.get('/', (req, res, next) => {
  res.render('index', { title: 'Welcome Gettin Assignment API service' });
});
app.get('/ping/', (req, res) => res.send('pong'));

app.use('/docs', (req, res, next) => {
    if(process.env.NODE_ENV === "production") {
        return res.status(404).send("Not Found");
    }
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    // Verify login and password are set and correct
    if (username && password && username === config.swaggerUI.username && password === config.swaggerUI.password) {
        // Access granted...
        return next();
    } else {
        // Access denied...
        res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
        res.status(401).send('Authentication required.'); // custom message
    }
});

if(process.env.NODE_ENV === "production") {
    app.use('/docs', (req, res, next) => {
        res.status(404).send("Not Found");
    });
}

// app.use(logging.errorLogger);
module.exports = app;
