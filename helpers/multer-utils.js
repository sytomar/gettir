const multer = require('multer');
const multerConfig = require('config').multer;
const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, multerConfig.storage_path);
    },
    filename: function(req, file, cb) {
        // add current datetime and random number to filename to avoid override files with the same name
        const unique_suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const splitter_char = ".";
        const filenameArray = file.originalname.split(splitter_char);
        var filename = "";
        if (filenameArray.length  > 1 ) {
            var ext = filenameArray.slice(-1).pop();
            var filename_without_ext = filenameArray.slice(0, -1).join(splitter_char);
            filename = `${filename_without_ext}-${unique_suffix}.${ext}`;
        } else {
            filename = `${file.originalname}-${unique_suffix}`;
        }
        file.originalname = filename;
        cb(null, filename);
    }
});

const multerUpload = multer({
    storage: multerStorage,
    limits: multerConfig
    // fileFilters to check allow file types
});

module.exports = {
    multerUpload
};
