import { z } from "zod";

export const CreateBookZodSchema = z.object(
    {
        title: z.string(),
        author: z.string(),
        genre: z.string(),
        isbn: z.string(),
        description: z.string().optional(),
        copies: z.number(),
        available: z.boolean().optional().default(true)
    }
);


export const UpdateBookZodSchema = z.object(
    {
        title: z.string().optional(),
        author: z.string().optional(),
        genre: z.string().optional(),
        isbn: z.string().optional(),
        description: z.string().optional(),
        copies: z.number().optional(),
        available: z.boolean().optional()
    }
);