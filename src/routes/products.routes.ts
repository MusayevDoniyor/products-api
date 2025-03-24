import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controller/products.controller.js";

const router = Router();

router.route("/").post(createProduct).get(getProducts);
router
  .route("/:id")
  .put(updateProduct)
  .get(getProductById)
  .delete(deleteProduct);

export default router;
