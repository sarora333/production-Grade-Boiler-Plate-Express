import { z } from "zod";

export const userSchema = z
  .object({
    name: z
      .string({ message: "Name is required and must be a string" })
      .trim()
      .min(1, "Name cannot be empty")
      .max(10, "Name cannot exceed 10 characters"),

    mobile: z
      .string({ message: "Mobile is required" })
      .trim()
      .length(10, "Mobile number must be exactly 10 digits"),

    email: z
      .string({ message: "Email is required and must be a string" })
      .email("Please provide a valid email address")
      .trim()
      .toLowerCase(),

    password: z
      .string({ message: "Password is required" })
      .min(3, "Password must be at least 3 characters")
      .max(10, "Password is too long"),
  })
  .strict("Unexpected extra fields are not allowed");

// Login only needs email + password
export const loginSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .email("Please provide a valid email address")
      .trim()
      .toLowerCase(),

    password: z
      .string({ message: "Password is required" })
      .min(1, "Password cannot be empty"),
  })
  .strict("Unexpected extra fields are not allowed");
