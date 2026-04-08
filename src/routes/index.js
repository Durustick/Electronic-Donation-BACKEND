const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");

const UserController = require("../controllers/user.controller");
const DeviceController = require("../controllers/device.controller");

const router = express.Router();

router.post("/login", UserController.login);

router.post("/register", UserController.register);

router.post(
  "/:userId/device/register",
  authMiddleware,
  DeviceController.register,
);

router.get("/devices", DeviceController.getDevices);

router.post(
  "/:idSolicitante/:idDispositivo/device-request",
  DeviceController.postDeviceRequest,
);

//router.get("/minha-rota", authMiddleware, dashboardController)

module.exports = router;
