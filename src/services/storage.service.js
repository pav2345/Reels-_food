const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file, fileName) {
  const result = await imagekit.upload({
    file,                     // buffer
    fileName,                 // must include .mp4
    mimeType: "video/mp4",    // 🔥 IMPORTANT
  });

  return result;
}

module.exports = {
  uploadFile,
};
