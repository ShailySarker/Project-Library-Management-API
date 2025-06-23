"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookZodSchema = exports.CreateBookZodSchema = void 0;
const zod_1 = require("zod");
exports.CreateBookZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number(),
    available: zod_1.z.boolean().optional().default(true)
});
exports.UpdateBookZodSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    genre: zod_1.z.string().optional(),
    isbn: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().optional(),
    available: zod_1.z.boolean().optional()
});
