import express from "express";
import {
  createRegisterUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../../controllers/UserContoller.js";
import { authMiddleware, authorizeRoles } from "../../middlewares/auth.js";
const UserRouter = express.Router();

UserRouter.get("/getuser", authMiddleware, authorizeRoles("admin"), getUsers);

UserRouter.get("/getuser/:id", getUserById);
UserRouter.put(
  "/updateuser/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateUser
);
UserRouter.put("/deleteuser/:id", deleteUser);

export default UserRouter;
