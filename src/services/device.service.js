const DeviceRepository = require("../repository/device.repository");

class DeviceService {
  async register(payload) {
    const response = await DeviceRepository.register(payload);
    return response;
  }

  async saveImage(urls, result) {
    await DeviceRepository.saveImage(urls, result);
  }
}

module.exports = new DeviceService();
