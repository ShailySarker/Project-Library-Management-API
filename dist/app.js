"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/controllers/book.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// routes
app.use("/api/books", book_controller_1.bookRouters);
app.use("/api/borrow", borrow_controller_1.borrowRouters);
// root page
app.get('/', (req, res) => {
    res.send('Welcome to Library Management API Server!!!');
});
// 404 error
app.use((req, res) => {
    res.status(404).json({ message: 'Sorry! The route is not found.' });
});
exports.default = app;
