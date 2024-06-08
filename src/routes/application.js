const express = require('express');
const application = require('../controllers/application');

const applicationRouter = express.Router();

applicationRouter.post('/apply', application.apply);
applicationRouter.get('/filter', application.filter);
applicationRouter.patch('/:id', application.updateById);
applicationRouter.get('/:id', application.getById);
applicationRouter.delete('/:id', application.deleteById);

module.exports = applicationRouter;