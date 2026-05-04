import ApiError from "../utils/apiError.js";

/**
 * Generic Zod validation middleware.
 * @param {import("zod").ZodSchema} schema - The Zod schema to validate against.
 * @param {"body" | "params" | "query"} source - Which part of the request to validate.
 */
const validate = (schema, source = "body") => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // Format Zod errors into a readable array of messages
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const message = errors.map((e) => `${e.field}: ${e.message}`).join(", ");
      return next(new ApiError(message, 400));
    }

    // Replace the source with cleaned/parsed data
    req[source] = result.data;
    next();
  };
};

export default validate;
