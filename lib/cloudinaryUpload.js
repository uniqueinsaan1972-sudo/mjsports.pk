// /lib/cloudinaryUpload.js - WORKING VERSION
export async function uploadProductImagesToCloudinary(files) {
  const urls = [];
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error("Cloudinary cloud name missing. Check .env.local");
  }

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mjsports.pk"); // ✅ Using existing preset
    formData.append("folder", "mj-sports/products");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary error:", errorData);
        throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Uploaded: ${file.name} → ${data.secure_url}`);
      urls.push(data.secure_url);
    } catch (error) {
      console.error(`❌ Error uploading ${file.name}:`, error);
      throw error;
    }
  }

  return urls;
}