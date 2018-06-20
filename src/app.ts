import express from 'express';
import compression from 'compression'; // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
import logger from './util/logger';
import lusca from 'lusca';
import dotenv from 'dotenv';
import mongo from 'connect-mongo';
import flash from 'express-flash';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import bluebird from 'bluebird';
import cors from 'cors';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.example' });

// Controllers (route handlers)
import * as apiController from './controllers/api';
import * as projectController from './controllers/project';
import * as timesheetController from './controllers/timesheet';
import * as userController from './controllers/user';
import * as expenseReportController from './controllers/expense-report';
import * as authController from './controllers/auth';

// API keys and Passport configuration

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;

mongoose
  .connect(
    mongoUrl,
    { useMongoClient: true }
  )
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch(err => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    );
    // process.exit();
  });

// Express configuration
app.set('port', process.env.PORT || 9001);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(expressValidator());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = req.path;
  } else if (req.user && req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

/**
 * API examples routes.
 */
// app.get('/api', apiController.getApi);
// app.get(
//   '/api/facebook',
//   passportConfig.isAuthenticated,
//   passportConfig.isAuthorized,
//   apiController.getFacebook
// );
app.get('/api/mock', apiController.mock);

app.post('/api/auth', authController.auth);

app.get('/api/projects/:id', projectController.findProject);
app.put('/api/projects/:id', projectController.updateProject);
app.get('/api/projects', projectController.getProjects);
app.post('/api/projects', projectController.createProject);
app.delete('/api/projects', projectController.removeProject);

app.get('/api/users/:id', userController.find);
app.put('/api/users/:id', userController.update);
app.get('/api/users', userController.list);
app.post('/api/users', userController.create);
app.delete('/api/users', userController.remove);

app.get('/api/timesheets/:id', timesheetController.find);
app.put('/api/timesheets/:id', timesheetController.update);
app.get('/api/timesheets', timesheetController.list);
app.post('/api/timesheets', timesheetController.create);
app.delete('/api/timesheets', timesheetController.remove);

app.get('/api/expense-reports/:id', expenseReportController.find);
app.put('/api/expense-reports/:id', expenseReportController.update);
app.get('/api/expense-reports', expenseReportController.list);
app.post('/api/expense-reports', expenseReportController.create);
app.delete('/api/expense-reports', expenseReportController.remove);

export default app;
