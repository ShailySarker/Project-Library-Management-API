import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: [true, "Book is required!"]
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be an integer number",
            },
        },
        dueDate: {
            type: Date,
            required: [true, "DueDate is required!"]
        }
    },
    {
        versionKey: false,
        timestamps: true
    }

);


export const Borrow = model<IBorrow>("Borrow", borrowSchema);