const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const companyRoute = require('./company.route');
const jobRoute = require('./job.route');
const referralRoute = require('./referral.route');
const notificationRoute = require('./notification.route');
const messageRoute = require('./message.route');
const conversationRoute = require('./conversation.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/companies',
    route: companyRoute,
  },
  {
    path: '/jobs',
    route: jobRoute,
  },
  {
    path: '/referrals',
    route: referralRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/messages',
    route: messageRoute,
  },
  {
    path: '/conversations',
    route: conversationRoute,
  },
];

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router; 