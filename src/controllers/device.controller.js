const deviceService = require("../services/device.service");
const { uploadBase64Images } = require("../services/upload.service");

class DeviceController {
  async register(request, response) {
    const { userId } = request.params;
    const { name, category, conservationState, description, images } =
      request.body;

    const payload = {
      userId,
      deviceName: name,
      category,
      conservationState,
      description,
    };

    const result = await deviceService.register(payload);

    let urls = [];
    if (images && images.length > 0) {
      urls = await uploadBase64Images(images);
    }

    await deviceService.saveImage(urls, result);

    return response.status(201).json(result);
  }
}

module.exports = new DeviceController();
