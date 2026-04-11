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

async function deleteImages(urls = []) {
  if (!Array.isArray(urls) || urls.length === 0) {
    console.log("Nenhuma imagem para deletar.");
    return;
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING não definida.");
  }

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  const resultados = [];

  for (const urlImagem of urls) {
    try {
      const url = new URL(urlImagem);

      const blobName = decodeURIComponent(url.pathname.split("/").pop());

      const containerClient = blobServiceClient.getContainerClient(
        process.env.AZURE_CONTAINER_NAME,
      );

      const blobClient = containerClient.getBlobClient(blobName);

      const response = await blobClient.deleteIfExists();

      resultados.push({
        url: urlImagem,
        deletado: response.succeeded,
      });
    } catch (error) {
      resultados.push({
        url: urlImagem,
        erro: error.message,
      });
    }
  }

  return resultados;
}

module.exports = {
  uploadBase64Images,
  deleteImages,
};
