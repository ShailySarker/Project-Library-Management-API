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
exports.borrowRouters = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
const borrow_zodSchemaValidation_1 = require("../zodSchemaValidations/borrow.zodSchemaValidation");
exports.borrowRouters = express_1.default.Router();
// Borrow a Book (Using Static Method)
exports.borrowRouters.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = yield borrow_zodSchemaValidation_1.CreateBorrowBookZodSchema.parseAsync(req.body);
        // static method to handle book deduction logic
        yield book_model_1.Book.borrowedBooks(book, quantity);
        const borrow = yield borrow_model_1.Borrow.create({
            book,
            quantity,
            dueDate,
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Borrowed Books Summary (Using Aggregation)
exports.borrowRouters.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo"
                }
            },
            {
                $unwind: "$bookInfo"
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn"
                    },
                    totalQuantity: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary
        });
    }
    catch (error) {
        next(error);
    }
}));
// Handling Global Error
exports.borrowRouters.use((error, req, res, next) => {
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
    // other error
    else {
        res.status(400).json({
            message: error.message || 'Sorry! Something went wrong.',
            success: false,
            error
        });
    }
});
