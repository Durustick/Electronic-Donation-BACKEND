const DeviceRepository = require("../repository/device.repository");
const { uploadBase64Images } = require("../services/upload.service");

class DeviceService {
  async register(payload, images) {
    const result = await DeviceRepository.register(payload);

    let urls = [];
    if (images && images.length > 0) {
      urls = await uploadBase64Images(images);
    }

    if (urls.length > 0) {
      await DeviceRepository.saveImage(urls, result);
    }

    return result;
  }

  async getDevices() {
    const devices = await DeviceRepository.getDevices();

    if (!devices || devices.length === 0) {
      return [];
    }

    const idsList = devices.map((r) => r.id);
    const images = await DeviceRepository.getImages(idsList);

    const result = devices.map((device) => {
      return {
        ...device,
        imagens: images.filter((img) => img.id_dispositivo === device.id),
      };
    });

    return result;
  }

  async getUserDevices(userId) {
    const devices = await DeviceRepository.getUserDevices(userId);

    if (!devices || devices.length === 0) {
      return [];
    }

    const idsList = devices.map((r) => r.id);
    const images = await DeviceRepository.getImages(idsList);

    const result = devices.map((device) => {
      return {
        ...device,
        imagens: images.filter((img) => img.id_dispositivo === device.id),
      };
    });

    return result;
  }

  async getUserRequests(userId) {
    return await DeviceRepository.getUserRequests(userId);
  }

  async getImages(idsList) {
    const response = await DeviceRepository.getImages(idsList);
    return response;
  }

  async saveImage(urls, result) {
    await DeviceRepository.saveImage(urls, result);
  }

  async postDeviceRequest(payload) {
    await DeviceRepository.postDeviceRequest(payload);
  }

  async updateStatus(deviceId, status) {
    await DeviceRepository.updateStatus(deviceId, status);
  }

  async userDeviceWithRequest(userId) {
    return await DeviceRepository.userDeviceWithRequest(userId);
  }
}

module.exports = new DeviceService();
