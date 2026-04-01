const express = require("express");
const LoginController = require("../controllers/user.controller");

const router = express.Router();

router.post("/login", LoginController.login);

//router.get("/minha-rota", authMiddleware, dashboardController)

module.exports = router;
