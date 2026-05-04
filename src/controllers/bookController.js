import bookService from "../services/bookService.js";
import ApiResponse from "../utils/apiRes.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * @desc    Create a new book
 * @route   POST /api/v1/books
 */
const createBook = catchAsync(async (req, res) => {
  const book = await bookService.createBook(req.body);

  res.status(201).json(new ApiResponse(201, book, "Book created successfully"));
});

/**
 * @desc    Get all books (paginated)
 * @route   GET /api/v1/books
 */
const getAllBooks = catchAsync(async (req, res) => {
  const result = await bookService.getAllBooks(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Books fetched successfully"));
});

/**
 * @desc    Get a single book by ID
 * @route   GET /api/v1/books/:id
 */
const getBookById = catchAsync(async (req, res) => {
  const book = await bookService.getBookById(req.params.id);

  res.status(200).json(new ApiResponse(200, book, "Book fetched successfully"));
});

/**
 * @desc    Update a book by ID
 * @route   PATCH /api/v1/books/:id
 */
const updateBook = catchAsync(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.body);

  res.status(200).json(new ApiResponse(200, book, "Book updated successfully"));
});

/**
 * @desc    Delete a book by ID
 * @route   DELETE /api/v1/books/:id
 */
const deleteBook = catchAsync(async (req, res) => {
  await bookService.deleteBook(req.params.id);

  res.status(200).json(new ApiResponse(200, null, "Book deleted successfully"));
});

export default {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
