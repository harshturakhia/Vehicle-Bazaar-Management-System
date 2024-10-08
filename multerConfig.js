const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        // const ext = path.extname(file.originalname); // Get file extension
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate unique suffix
        // cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Filename format: fieldname-timestamp.extension

        const ext = path.extname(file.originalname);
        const originalName = path.basename(file.originalname, ext);
        const extra = Math.round(Math.random() * 100);
        const todayDate = new Date().toISOString().split('T')[0];

        const newFileName = `image-${originalName}-${todayDate}--${extra}${ext}`;

        cb(null, newFileName);
    }
});

// File filter function (optional)
const fileFilter = (req, file, cb) => {
    // Accept only specific filetypes (e.g., images)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept file
    }
    else {
        cb(new Error('Only images are allowed!'), false); // Reject file
    }
};

// Initialize Multer instance with configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
