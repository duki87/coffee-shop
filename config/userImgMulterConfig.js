const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './public/uploads/profiles/')
    },
    filename: (req, file, cb) => {
        imageName = Date.now() +'-'+ file.originalname;
        cb(null, imageName);
    }
});

const fileFilter = (req, file, cb) => {
    //reject incoming file if filetype is not supported
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});

module.exports = {
    storage:storage, 
    fileFilter:fileFilter, 
    upload:upload
}