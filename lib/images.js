// Cloudinary delivery optimisation (auto format + quality + width). Other URLs pass through.
export function img(url, width = 800) {
  if (!url || typeof url !== "string") return "";
  if (url.includes("res.cloudinary.com") && url.includes("/upload/") && !/\/upload\/[a-z]_/.test(url)) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}
