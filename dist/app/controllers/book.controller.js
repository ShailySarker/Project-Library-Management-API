"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouters = void 0;
const express_1 = __importDefault(require("express"));
const book_zodSchemaValidation_1 = require("../zodSchemaValidations/book.zodSchemaValidation");
const book_model_1 = require("../models/book.model");
exports.bookRouters = express_1.default.Router();
// Create Book
exports.bookRouters.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield book_zodSchemaValidation_1.CreateBookZodSchema.parseAsync(req.body);
        if (body.copies === 0) {
            body.available = false;
        }
        else {
            body.available = true;
        }
        const book = yield book_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Get All Books
exports.bookRouters.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10" } = req.query;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const orderSorting = sort === "desc" ? -1 : 1;
        const books = yield book_model_1.Book
            .find(query)
            .sort({ [sortBy]: orderSorting })
            .limit(parseInt(limit));
        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: books,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Get Book by ID
exports.bookRouters.get("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book is not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        next(error);
    }
}));
// Update Book
exports.bookRouters.put("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: 'Book is not found',
                data: null
            });
        }
        const body = yield book_zodSchemaValidation_1.UpdateBookZodSchema.parseAsync(req.body);
        if (body.copies === 0) {
            body.available = false;
        }
        else {
            body.available = true;
        }
        const updatedBook = yield book_model_1.Book.findByIdAndUpdate(bookId, body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        });
    }
    catch (error) {
        next(error);
    }
}));
// Deleting Book
exports.bookRouters.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: 'Book is not found',
                data: null
            });
        }
        const deleteBook = yield book_model_1.Book.findByIdAndDelete(bookId);
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: null
        });
    }
    catch (error) {
        next(error);
    }
}));
// Handling Global Error
exports.bookRouters.use((error, req, res, next) => {
    // validation error
    if (error.name === 'ValidationError') {
        res.status(400).json({
            message: 'Validation failed',
            success: false,
            error: {
                name: error.name,
                errors: error.errors
            }
        });
    }
    // cast error
    else if (error.name === "CastError") {
        res.status(404).json({
            message: 'Book is not found',
            success: false,
            error: {
                name: error.name,
                errors: error
            }
        });
    }
    // duplicate key error
    else if (error.name === "MongoServerError" && error.code === 11000) {
        res.status(409).json({
            message: "Duplicate key error",
            success: false,
            error: {
                name: error.name,
                errors: error,
            }
        });
    }
    // others error
    else {
        res.status(400).json({
            message: error.message || 'Sorry! Something went wrong.',
            success: false,
            error
        });
    }
});
