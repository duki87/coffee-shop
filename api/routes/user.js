const express = require('express');
const router = express.Router();
const multerConfig = require('../../config/userImgMulterConfig');
const upload = multerConfig.upload;
const fs = require('fs');
const controller = require('../controllers/user');
const passportAuth = require('../../config/passportAuth');

//Front routes 
router.get('/', passportAuth.jwt, controller.profile);    

router.get('/register', controller.getRegister);

router.get('/login', controller.getLogin);

router.post('/login', controller.postLogin);

router.post('/register', upload.single('image'), controller.postRegister);

router.get('/logout', passportAuth.jwt, controller.logout);

router.post('/change-photo', passportAuth.jwt, upload.single('image'), controller.changePhoto);

router.post('/edit-profile', passportAuth.jwt, controller.editProfile);

module.exports = router;