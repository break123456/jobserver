const express = require('express');
const globaldata= require('../controllers/globaldata');

const globalDataRouter = express.Router();
globalDataRouter.get('/skills', globaldata.skills);
globalDataRouter.get('/preferences', globaldata.preferences);
globalDataRouter.get('/cities', globaldata.cities);

module.exports = globalDataRouter;