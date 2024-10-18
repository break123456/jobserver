const express = require('express');
const captcha = require('../controllers/captcha');

const captchaRouter = express.Router();

captchaRouter.get('/get', captcha.generate);
captchaRouter.post('/verify', captcha.verify);
captchaRouter.post('/mail', captcha.sendMail);

module.exports = captchaRouter;