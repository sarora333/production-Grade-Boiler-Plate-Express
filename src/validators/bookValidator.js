import { z } from "zod";

// Reusable: validates a MongoDB ObjectId string
const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// Schema for creating a new book (all required fields)
const createBookSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(1, "Title cannot be empty")
      .max(100, "Title cannot exceed 100 characters"),

    author: z
      .string({ required_error: "Author is required" })
      .trim()
      .min(1, "Author cannot be empty"),

    publishedDate: z.string().optional(),
  })
  .strict();

// Schema for updating a book (all fields optional, but at least one required)
const updateBookSchema = createBookSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export { createBookSchema, updateBookSchema, mongoIdSchema };
