const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const controller = require('../controllers/index');

router.get('/', controller.homepage);

module.exports = router;