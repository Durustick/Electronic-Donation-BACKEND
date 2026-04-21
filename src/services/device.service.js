const DeviceRepository = require('../repository/device.repository');
const {
  uploadBase64Images,
  deleteImages,
} = require('../services/upload.service');

class DeviceService {
  async register(payload, images) {
    const deviceId = await DeviceRepository.register(payload);

    let urls = [];
    if (images && images.length > 0) {
      urls = await uploadBase64Images(images);
    }

    if (urls.length > 0) {
      await DeviceRepository.saveImage(urls, deviceId);
    }

    return deviceId;
  }

  async getDevices(userId) {
    const devices = await DeviceRepository.getDevices(userId);

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

    const devicesWithImages = devices.map((device) => {
      return {
        ...device,
        imagens: images.filter((img) => img.id_dispositivo === device.id),
      };
    });

    const result = devicesWithImages.map((device) => ({
      ...device,
      status: device.solicitacoes?.some((req) => req.status === 'aceito')
        ? 'Aceito'
        : 'Pendente',
    }));

    return result;
  }

  async getUserRequests(userId) {
    return await DeviceRepository.getUserRequests(userId);
  }

  async getImages(idsList) {
    const response = await DeviceRepository.getImages(idsList);
    return response;
  }

  async saveImage(urls, deviceId) {
    await DeviceRepository.saveImage(urls, deviceId);
  }

  async postDeviceRequest(payload) {
    await DeviceRepository.postDeviceRequest(payload);
  }

  async updateStatus(deviceId, status) {
    await DeviceRepository.updateStatus(deviceId, status);
  }

  async userDeviceWithRequest(userId) {
    const data = await DeviceRepository.userDeviceWithRequest(userId);
    return (
      data?.flatMap((device) => {
        if (!device.solicitacoes) {
          return [];
        }
        return device.solicitacoes
          .filter((req) => req.status === 'pendente')
          .map((req) => ({
            ...req,
            dispositivo: { nome_dispositivo: device.nome_dispositivo },
          }));
      }) || []
    );
  }

  async updateDevice(payload, images, imagesToDelete) {
    let urls = [];

    if (images && images.length > 0) {
      urls = await uploadBase64Images(images);
    }

    if (urls.length > 0) {
      await DeviceRepository.saveImage(urls, payload.deviceId);
    }

    if (imagesToDelete.length > 0) {
      const urls = await DeviceRepository.deleteImages(imagesToDelete);
      await deleteImages(urls);
    }

    return await DeviceRepository.updateDevice(payload);
  }

  async deleteDevice(deviceId) {
    const urls = await DeviceRepository.deleteDevice(deviceId);

    await deleteImages(urls);
  }
}

module.exports = new DeviceService();
