import Book from "../models/Book.js";
import ApiError from "../utils/apiError.js";

/**
 * Create a new book.
 * @param {Object} bookData - Validated book data from Zod.
 * @returns {Promise<Object>} The created book document.
 */
const createBook = async (bookData) => {
  const book = await Book.create(bookData);
  return book;
};

/**
 * Get all books with optional pagination.
 * @param {Object} query - Query params for pagination (page, limit).
 * @returns {Promise<Object>} Paginated result with books and metadata.
 */
const getAllBooks = async (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const skip = (page - 1) * limit;

  const [books, total] = await Promise.all([
    Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Book.countDocuments(),
  ]);

  return {
    books,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single book by its ID.
 * @param {string} bookId - The MongoDB ObjectId.
 * @returns {Promise<Object>} The found book document.
 * @throws {ApiError} If the book is not found.
 */
const getBookById = async (bookId) => {
  const book = await Book.findById(bookId).lean();

  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  return book;
};

/**
 * Update a book by its ID.
 * @param {string} bookId - The MongoDB ObjectId.
 * @param {Object} updateData - Validated update data from Zod.
 * @returns {Promise<Object>} The updated book document.
 * @throws {ApiError} If the book is not found.
 */
const updateBook = async (bookId, updateData) => {
  const book = await Book.findByIdAndUpdate(bookId, updateData, {
    new: true, // Return the updated document
    runValidators: true, // Run Mongoose schema validators on update
  });

  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  return book;
};

/**
 * Delete a book by its ID.
 * @param {string} bookId - The MongoDB ObjectId.
 * @returns {Promise<Object>} The deleted book document.
 * @throws {ApiError} If the book is not found.
 */
const deleteBook = async (bookId) => {
  const book = await Book.findByIdAndDelete(bookId);

  if (!book) {
    throw new ApiError("Book not found", 404);
  }

  return book;
};

export default {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
