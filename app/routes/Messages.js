import * as messageControllers from "../controllers/MessagesController.js";
import express from "express";

const router = express.Router();

router.get("/", messageControllers.getMessages);
router.post("/send", messageControllers.sendSingleMessage);

router.delete("/delete/:id", messageControllers.deleteMessageById);

// ONLY ENABLE THIS CODE WHEN DELETING MESSAGES.
// router.delete("/admin/delete-all", messageControllers.deleteAllMessages);

export default router;
