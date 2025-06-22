import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { CreateBorrowBookZodSchema } from "../zodSchemaValidations/borrow.zodSchemaValidation";


export const borrowRouters = express.Router();


// Borrow a Book (Using Static Method)
borrowRouters.post("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { book, quantity, dueDate } = await CreateBorrowBookZodSchema.parseAsync(req.body);

        // static method to handle book deduction logic
        await Book.borrowedBooks(book, quantity);

        const borrow = await Borrow.create({
            book,
            quantity,
            dueDate,
        });

        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });

    } catch (error) {
        next(error);
    }
});


// Borrowed Books Summary (Using Aggregation)
borrowRouters.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const summary = await Borrow.aggregate([
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

    } catch (error) {
        next(error);
    }
});


// Handling Global Error
borrowRouters.use((error: any, req: Request, res: Response, next: NextFunction) => {

    // validation error
    if (error.name === 'ValidationError') {
        res.status(400).json({
            message: 'Validation failed',
            success: false,
            error: {
                name: error.name,
                errors: error.errors
            }
        })
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
        })
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