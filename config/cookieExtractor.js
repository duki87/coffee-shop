cookieExtractor = (req) => {
    var extracted = null;
    if (req && req.cookies) extracted = req.cookies['jwt'];
    return extracted;
}; 

module.exports = cookieExtractor;