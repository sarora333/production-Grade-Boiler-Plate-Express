import { Router } from "express";
import bookController from "../controllers/bookController.js";
import validate from "../middlewares/validate.js";
import {
  createBookSchema,
  updateBookSchema,
  mongoIdSchema,
} from "../validators/bookValidator.js";
import { z } from "zod";

const router = Router();

// Wrap mongoIdSchema in an object schema so validate middleware can parse req.params
const paramsIdSchema = z.object({ id: mongoIdSchema });

// POST   /api/v1/books       → Create a new book
router.post("/", validate(createBookSchema, "body"), bookController.createBook);

// GET    /api/v1/books       → Get all books (paginated via ?page=&limit=)
router.get("/", bookController.getAllBooks);

// GET    /api/v1/books/:id   → Get a single book
router.get(
  "/:id",
  validate(paramsIdSchema, "params"),
  bookController.getBookById,
);

// PATCH  /api/v1/books/:id   → Update a book
router.patch(
  "/:id",
  validate(paramsIdSchema, "params"),
  validate(updateBookSchema, "body"),
  bookController.updateBook,
);

// DELETE /api/v1/books/:id   → Delete a book
router.delete(
  "/:id",
  validate(paramsIdSchema, "params"),
  bookController.deleteBook,
);

export default router;
