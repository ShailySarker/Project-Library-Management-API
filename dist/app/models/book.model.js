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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
;
const bookSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false
});
// PRE_middleware for _id validity
bookSchema.pre("findOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = this.getQuery();
        if (query._id && !mongoose_1.Types.ObjectId.isValid(query._id)) {
            const error = new Error(`Invalid bookID! No book found in ID: '${query._id}'. Kindly enter a valid bookID.`);
            error.statusCode = 400;
            return next(error);
        }
        next();
    });
});
// POST_middleware after update
bookSchema.post('findOneAndUpdate', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            console.log(`"${doc.title}", book is updated!!`);
        }
    });
});
// POST_middleware after delete book
bookSchema.post('findOneAndDelete', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            console.log(`"${doc.title}", book is deleted!!`);
        }
    });
});
// Static Method
bookSchema.statics.borrowedBooks = function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
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
        return yield book.save();
    });
};
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
