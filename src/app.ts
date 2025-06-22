import express, { Application, Request, Response } from "express";
import { bookRouters } from "./app/controllers/book.controller";
import { borrowRouters } from "./app/controllers/borrow.controller";

const app: Application = express();
app.use(express.json());


// routes
app.use("/api/books", bookRouters);
app.use("/api/borrow", borrowRouters);


// root page
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Library Management API Server!!!')
});


// 404 error
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Sorry! The route is not found.' })
});


export default app;