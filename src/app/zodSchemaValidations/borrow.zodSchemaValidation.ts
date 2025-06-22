import { z } from "zod";

export const CreateBorrowBookZodSchema = z.object(
    {
        book: z.string(),
        quantity: z.number(),
        dueDate: z.string()
    }
);