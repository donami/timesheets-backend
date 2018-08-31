import express from 'express';
import compression from 'compression'; // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
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
import jwt from 'jsonwebtoken';
import multer from 'multer';

import logger from './util/logger';
import { MONGODB_URI, SESSION_SECRET, ENVIRONMENT } from './util/secrets';
import jwtConfig from './config/jwt';

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.example' });

// Controllers (route handlers)
import * as apiController from './controllers/api';
import * as logController from './controllers/log';
import * as projectController from './controllers/project';
import * as questionCategoryController from './controllers/question-category';
import * as questionArticleController from './controllers/question-article';
import * as notificationController from './controllers/notification';
import * as timesheetController from './controllers/timesheet';
import * as userController from './controllers/user';
import * as expenseReportController from './controllers/expense-report';
import * as authController from './controllers/auth';
import * as timesheetTemplateController from './controllers/timesheet-template';
import * as groupController from './controllers/group';
import * as setupController from './controllers/setup';
import { WithAuth } from './types';

// API keys and Passport configuration

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;

mongoose
  .connect(
    mongoUrl
    // { useMongoClient: true }
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
app.set('superSecret', jwtConfig.secret);

app.use(compression());

app.use(cors());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(undefined, './dist/public/images');
    // if (ENVIRONMENT === 'production') {
    //   cb(undefined, './public/images/uploads');
    // } else {
    //   cb(undefined, './dist/public/images/uploads');
    // }
  },
  filename: function(req, file, cb) {
    cb(
      undefined,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

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
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// })
// app.use((req, res, next) => {
//   // After successful login, redirect back to the intended page
//   if (
//     !req.user &&
//     req.path !== '/login' &&
//     req.path !== '/signup' &&
//     !req.path.match(/^\/auth/) &&
//     !req.path.match(/\./)
//   ) {
//     req.session.returnTo = req.path;
//   } else if (req.user && req.path == '/account') {
//     req.session.returnTo = req.path;
//   }
//   next();
// });

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/is-configured', setupController.isConfigured);
app.post('/api/setup', setupController.setup);
app.get('/api/mock', apiController.mock);
app.post('/api/auth/recover-password', authController.recoverPassword);
app.post('/api/auth', authController.auth);
app.get('/api/verify-token', authController.verify);

app.use((req: express.Request & WithAuth, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    return jwt.verify(
      token,
      app.get('superSecret'),
      (err: any, decoded: any) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.',
          });
        }
        req.user = decoded;

        return next();
      }
    );
  }

  return res.status(403).send({
    success: false,
    message: 'No token provided.',
  });
});

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

app.get('/api/auth/clear-notifications', authController.clearNotifications);
app.post(
  '/api/auth/upload-profile-image',
  upload.single('avatar'),
  authController.uploadProfileImage
);

app.get('/api/logs/:id', logController.find);
app.get('/api/logs', logController.list);

app.get('/api/projects/:id', projectController.findProject);
app.put('/api/projects/:id', projectController.updateProject);
app.get('/api/projects', projectController.getProjects);
app.post('/api/projects', projectController.createProject);
app.delete('/api/projects', projectController.removeProject);

app.get('/api/notifications/:id', notificationController.find);
app.put('/api/notifications/:id', notificationController.update);
app.get('/api/notifications', notificationController.list);
app.post('/api/notifications', notificationController.create);
app.delete('/api/notifications', notificationController.remove);

app.get('/api/question-categories/:id', questionCategoryController.find);
app.put('/api/question-categories/:id', questionCategoryController.update);
app.get('/api/question-categories', questionCategoryController.list);
app.post('/api/question-categories', questionCategoryController.create);
app.delete('/api/question-categories/:id', questionCategoryController.remove);

app.get('/api/question-articles/:id', questionArticleController.find);
app.put('/api/question-articles/:id', questionArticleController.update);
app.put(
  '/api/question-articles/:id/give-feedback',
  questionArticleController.giveFeedback
);
app.get('/api/question-articles', questionArticleController.list);
app.post('/api/question-articles', questionArticleController.create);
app.delete('/api/question-articles/:id', questionArticleController.remove);

app.put('/api/users/:id/disable', userController.disable);
app.put('/api/users/:id/enable', userController.enable);
app.get('/api/users/:id', userController.find);
app.put('/api/users/:id', userController.update);
app.get('/api/users', userController.list);
app.post('/api/users', userController.create);
app.delete('/api/users', userController.remove);

app.get('/api/timesheet-templates/:id', timesheetTemplateController.find);
app.put('/api/timesheet-templates/:id', timesheetTemplateController.update);
app.get('/api/timesheet-templates', timesheetTemplateController.list);
app.post('/api/timesheet-templates', timesheetTemplateController.create);
app.delete('/api/timesheet-templates', timesheetTemplateController.remove);

app.put('/api/groups/update-group-member', groupController.updateGroupMember);
app.get('/api/groups/:id', groupController.find);
app.put('/api/groups/:id', groupController.update);
app.post('/api/groups', groupController.list);
app.post('/api/groups/create', groupController.create);
app.delete('/api/groups/:id', groupController.remove);

app.get('/api/timesheets/:id', timesheetController.find);
app.put('/api/timesheets/:id', timesheetController.update);
app.get('/api/timesheets', timesheetController.list);
app.post('/api/timesheets', timesheetController.create);
app.delete('/api/timesheets/:id', timesheetController.remove);
app.post('/api/timesheets/create-timesheets', timesheetController.createMany);

app.get('/api/expense-reports/:id', expenseReportController.find);
app.put('/api/expense-reports/:id', expenseReportController.update);
app.get('/api/expense-reports', expenseReportController.list);
app.post('/api/expense-reports', expenseReportController.create);
app.delete('/api/expense-reports', expenseReportController.remove);

export default app;
