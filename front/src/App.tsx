import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        "https://driveimguploader.onrender.com/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadStatus("Upload successful! File ID: " + response.data.fileId);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Upload failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Event Photo Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload Image</button>
      <p>{uploadStatus}</p>
    </div>
  );
}

export default App;
