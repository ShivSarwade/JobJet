import { v2 as cloudinary } from 'cloudinary'; 
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resource_type = "raw") => {
    try {
        if (!localFilePath) return console.log(`Could not find file at ${localFilePath}`);

        // Upload the file to Cloudinary with resource_type set to 'raw' and access_mode set to 'public'
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resource_type,  // Explicitly set resource type to 'raw' for PDFs and other non-image files
            access_mode: 'public',         // Ensure the file is publicly accessible
        });

        // Remove the local file after uploading
        fs.unlinkSync(localFilePath);

        console.log("File uploaded on public URL:", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the local file if an error occurs
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

const deleteFromCloudinary = async (fileUrl) => {
    try {
        if (!fileUrl) return console.log("No file URL provided for deletion");

        // Extract public ID from the URL (assuming Cloudinary URL structure)
        const publicId = fileUrl.split('/').pop().split('.')[0];

        const response = await cloudinary.uploader.destroy(publicId);
        console.log("File deleted from public URL:", response);

        return response;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
