const deviceService = require("../services/device.service");

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

    const result = await deviceService.register(payload, images);

    return response.status(201).json(result);
  }

  async getDevices(request, response) {
    try {
      const result = await deviceService.getDevices();

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async getUserDevices(request, response) {
    try {
      const { userId } = request.params;
      const result = await deviceService.getUserDevices(userId);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async getUserRequests(request, response) {
    try {
      const { userId } = request.params;
      const result = await deviceService.getUserRequests(userId);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  async postDeviceRequest(request, response) {
    try {
      const { idSolicitante, idDispositivo } = request.params;
      const { justificativa } = request.body;

      const payload = {
        idSolicitante,
        idDispositivo,
        justificativa,
      };

      const result = await deviceService.postDeviceRequest(payload);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DeviceController();
