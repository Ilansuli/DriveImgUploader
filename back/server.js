const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });

// Enable CORS for all routes
app.use(cors());

// Load Google Drive credentials
const GOOGLE_DRIVE_CREDENTIALS = JSON.parse(
  process.env.GOOGLE_DRIVE_CREDENTIALS
);
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_DRIVE_CREDENTIALS, // Use credentials directly
  scopes: SCOPES,
});

// Google Drive API instance
const drive = google.drive({ version: "v3", auth });

// Upload file to Google Drive
async function uploadFileToDrive(filePath, fileName) {
  const fileMetadata = {
    name: fileName,
    parents: ["19BU9NTjd28wtgHVNzMgCuR5gu7-WGX-2"], // Change to your folder ID
  };
  const media = { mimeType: "image/jpeg", body: fs.createReadStream(filePath) };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });

  return response.data;
}

// Endpoint for file upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { path: filePath, originalname: fileName } = req.file;
    const fileData = await uploadFileToDrive(filePath, fileName);

    // Clean up the uploaded file from the server
    fs.unlinkSync(filePath);

    res.status(200).send({ fileId: fileData.id });
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    res.status(500).send("Error uploading file");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
