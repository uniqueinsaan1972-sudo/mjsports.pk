// Uploads product images to Cloudinary using the existing unsigned preset.
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadProductImagesToCloudinary(files) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Cloudinary cloud name is missing. Check .env.local");

  const urls = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
    if (file.size > MAX_BYTES) throw new Error(`${file.name} is larger than 10 MB.`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mjsports.pk");
    formData.append("folder", "mj-sports/products");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Upload failed: ${err.error?.message || response.statusText}`);
    }
    const data = await response.json();
    urls.push(data.secure_url);
  }
  return urls;
}
