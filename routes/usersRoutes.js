import express from "express";
import {
  listUsers,
  register,
  login,
  confirm,
  deleteUser,
  editUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(listUsers).post(register);

router.route("/:id").get(oneUser).put(editUser).delete(deleteUser);

export default router;
