const auth = require('../../config/auth');
const cookieExtractor = require('../../config/cookieExtractor');
const cookieCartExtractor = require('../../config/cookieCartExtractor');

const controller = {
    homepage: (req, res, next) => {
        const cartCookie = cookieCartExtractor(req);
        const token = cookieExtractor(req);
        const isLogged = auth(token);
        res.render('index', {
            title: 'Welcome to Coffee shop!',
            isLogged: isLogged,
            active_page: 'index',
            cart_exist: cartCookie ? true : false
        });
    }
}

module.exports = controller;