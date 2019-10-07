cookieCartExtractor = (req) => {
    var cookie = null;
    if (req && req.cookies) cookie = req.cookies['cart'];
    return cookie;
}; 

module.exports = cookieCartExtractor;