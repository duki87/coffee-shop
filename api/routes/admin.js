const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('admin', {
        title: 'Welcome to the admin page!'
    });
});

module.exports = router;