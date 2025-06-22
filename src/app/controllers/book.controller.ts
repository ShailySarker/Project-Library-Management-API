import express, { NextFunction, Request, Response } from "express";
import { CreateBookZodSchema, UpdateBookZodSchema } from "../zodSchemaValidations/book.zodSchemaValidation";
import { Book } from "../models/book.model";


export const bookRouters = express.Router();


// Create Book
bookRouters.post("/", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const body = await CreateBookZodSchema.parseAsync(req.body);

        if (body.copies === 0) {
            body.available = false;
        } else {
            body.available = true
        }

        const book = await Book.create(body);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });

    } catch (error: any) {
        next(error);
    }

});


// Get All Books
bookRouters.get("/", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10" } = req.query;

        const query: any = {};
        if (filter) {
            query.genre = filter;
        }

        const orderSorting = sort === "desc" ? -1 : 1;

        const books = await Book
            .find(query)
            .sort({ [sortBy as string]: orderSorting })
            .limit(parseInt(limit as string));

        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: books,
        });

    } catch (error) {
        next(error);
    }

});


// Get Book by ID
bookRouters.get("/:bookId", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const bookId = req.params.bookId;

        const book = await Book.findById(bookId);

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

    } catch (error) {
        next(error);
    }

});


// Update Book
bookRouters.put("/:bookId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;

        const book = await Book.findById(bookId);

        if (!book) {
            res.status(404).json({
                success: false,
                message: 'Book is not found',
                data: null
            });
        }

        const body = await UpdateBookZodSchema.parseAsync(req.body);

        if (body.copies === 0) {
            body.available = false;
        } else {
            body.available = true
        }

        const updatedBook = await Book.findByIdAndUpdate(bookId, body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        });

    } catch (error) {
        next(error);
    }

});


// Deleting Book
bookRouters.delete("/:bookId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId);

        if (!book) {
            res.status(404).json({
                success: false,
                message: 'Book is not found',
                data: null
            });
        }

        const deleteBook = await Book.findByIdAndDelete(bookId);

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: null
        });

    } catch (error) {
        next(error);
    }
});


// Handling Global Error
bookRouters.use((error: any, req: Request, res: Response, next: NextFunction) => {

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
    // others error
    else {
        res.status(400).json({
            message: error.message || 'Sorry! Something went wrong.',
            success: false,
            error
        });
    }

});