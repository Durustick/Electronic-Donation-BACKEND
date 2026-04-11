const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");

const UserController = require("../controllers/user.controller");
const DeviceController = require("../controllers/device.controller");

const router = express.Router();

router.post("/login", UserController.login);

router.post("/register", UserController.register);

router.get("/devices", DeviceController.getDevices);

router.get("/:userId/devices", authMiddleware, DeviceController.getUserDevices);

router.post(
  "/:userId/device/register",
  authMiddleware,
  DeviceController.register,
);

router.put(
  "/:deviceId/device/update",
  authMiddleware,
  DeviceController.updateDevice,
);

router.delete(
  "/:deviceId/device/delete",
  authMiddleware,
  DeviceController.deleteDevice,
);

router.get(
  "/:userId/requests",
  authMiddleware,
  DeviceController.getUserRequests,
);

router.get(
  "/:userId/user-device-with-request",
  authMiddleware,
  DeviceController.userDeviceWithRequest,
);

router.put(
  "/:deviceId/updateStatus",
  authMiddleware,
  DeviceController.updateStatus,
);

router.post(
  "/:idSolicitante/:idDispositivo/device-request",
  authMiddleware,
  DeviceController.postDeviceRequest,
);

//router.get("/minha-rota", authMiddleware, dashboardController)

module.exports = router;
