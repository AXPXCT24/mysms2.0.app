import express from "express";

const router = express.Router();

router.get("/");
router.get("/:gsm_number");

router.post("/register-port");
router.put("/update-port/:gsm_number");

router.delete("/delete/:gsm_number");
router.delete("/admin/delete-all");

export default router;
