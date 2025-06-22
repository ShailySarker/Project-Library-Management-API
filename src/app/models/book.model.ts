import { model, Schema, Types } from "mongoose";
import { IBook } from "../interfaces/book.interface";
import { Model } from "mongoose";


interface BookStaticMethods extends Model<IBook> {
    borrowedBooks(bookId: string, quantity: number): Promise<void>;
};


const bookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: [true, "Title is required!"]
        },
        author: {
            type: String,
            required: [true, "Author is required!"]
        },
        genre: {
            type: String,
            required: [true, "Genre is required!"],
            enum: {
                values: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
                message: "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
            },
        },
        isbn: {
            type: String,
            unique: true,
            required: [true, "ISBN is required!"]
        },
        description: {
            type: String,
            required: false
        },
        copies: {
            type: Number,
            required: [true, "Copies is required"],
            min: [0, "Copies must be a positive number"],
            validate: {
                validator: Number.isInteger,
                message: "Copies must be a positive number"
            }
        },
        available: {
            type: Boolean,
            // required: false
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);


// PRE_middleware for _id validity
bookSchema.pre("findOne", async function (next) {
    const query = this.getQuery();

    if (query._id && !Types.ObjectId.isValid(query._id)) {
        const error = new Error(`Invalid bookID! No book found in ID: '${query._id}'. Kindly enter a valid bookID.`);
        (error as any).statusCode = 400;
        return next(error);
    }

    next();
});


// POST_middleware after update
bookSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        console.log(`"${doc.title}", book is updated!!`);
    }
});

// POST_middleware after delete book
bookSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        console.log(`"${doc.title}", book is deleted!!`);
    }
});


// Static Method
bookSchema.statics.borrowedBooks = async function (bookId: string, quantity: number): Promise<void> {
    const book = await this.findById(bookId);

    if (!book) {
        throw new Error("Book is not found");
    }

    if (book.copies < quantity) {
        throw new Error("Not enough copies are available");
    }

    book.copies -= quantity;

    if (book.copies === 0) {
        book.available = false;
    }
    
    return await book.save();
};


export const Book = model<IBook, BookStaticMethods>("Book", bookSchema);
