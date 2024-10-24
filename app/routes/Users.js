import express from "express";

import * as usersController from "../controllers/UsersController.js";

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:user_id", usersController.getUserById);

router.post("/create-user", usersController.createUser);

// improve logic for edit user feature (change password or change username)
// router.put("/edit-user/:user_id", usersController.editUserDetails);

router.delete("/delete-user/:user_id", usersController.deleteUserById);
// router.delete("/admin/delete-all", usersController.deleteUsers);

export default router;
