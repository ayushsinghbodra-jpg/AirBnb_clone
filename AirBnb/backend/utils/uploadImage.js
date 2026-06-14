const cloudinary = require('../config/cloudinary.js');

const uploadImage = async (folder, filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

module.exports = uploadImage;