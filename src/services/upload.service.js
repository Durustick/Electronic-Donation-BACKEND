const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

const containerName = process.env.AZURE_CONTAINER_NAME;

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

async function uploadBase64Images(images) {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const urls = [];

  for (const base64Image of images) {
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

    if (!matches) throw new Error("Formato inválido Base64");

    const mimeType = matches[1];
    const base64Data = matches[2];

    const extension = mimeType.split("/")[1];

    const buffer = Buffer.from(base64Data, "base64");

    const blobName = `${uuidv4()}.${extension}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: mimeType,
      },
    });

    urls.push(blockBlobClient.url);
  }

  return urls;
}

module.exports = {
  uploadBase64Images,
};
