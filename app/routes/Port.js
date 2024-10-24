import express from "express";
import * as portController from "../controllers/PortController.js";

const router = express.Router();

router.get("/");
router.get("/:gsm_number", portController.getGsmPortById);

router.post("/register-port", portController.registerPort);
router.put("/update-port/:gsm_number");

router.delete("/delete/:gsm_number", portController.deletePortById);
router.delete("/admin/delete-all");

export default router;
