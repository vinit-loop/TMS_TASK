import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../controllers/CategoryController.js";
import { authMiddleware, authorizeRoles } from "../../middlewares/auth.js";

const CategoryRouter = express.Router();

CategoryRouter.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createCategory
);
CategoryRouter.get("/", getCategories);
CategoryRouter.put("/:id", updateCategory);
CategoryRouter.delete("/:id", deleteCategory);

export default CategoryRouter;
